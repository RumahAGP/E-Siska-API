import { upsertRaporRepo } from "../repositories/rapor.repository";
import logger from "../utils/logger";
import AppError from "../utils/AppError";
import { prisma } from "../config/prisma";
import {
  getAbsensiSummaryRepo,
  getNilaiRaporRepo,
  getNilaiEkskulRepo,
  getRaporDataRepo,
  getRaporBySiswaIdRepo,
} from "../repositories/rapor.repository";

interface InputRaporService {
  guruId: string;
  siswaId: string;
  tahunAjaranId: string;
  catatan?: string;
  kokurikuler?: string;
}

export const inputDataRaporService = async (input: InputRaporService) => {
  logger.info(
    `Mencoba update data rapor siswa ${input.siswaId} oleh guru ${input.guruId}`
  );

  const penempatan = await prisma.penempatanSiswa.findUnique({
    where: {
      siswaId_tahunAjaranId: {
        siswaId: input.siswaId,
        tahunAjaranId: input.tahunAjaranId,
      },
    },
    include: { kelas: true },
  });

  if (!penempatan) {
    throw new AppError(
      "Siswa belum ditempatkan di kelas untuk tahun ajaran ini.",
      404
    );
  }

  if (penempatan.kelas.waliKelasId !== input.guruId) {
    throw new AppError("Anda bukan Wali Kelas dari siswa ini.", 403);
  }

  const existingRapor = await prisma.rapor.findUnique({
    where: {
      siswaId_tahunAjaranId: {
        siswaId: input.siswaId,
        tahunAjaranId: input.tahunAjaranId,
      },
    },
  });

  if (existingRapor?.isFinalisasi) {
    throw new AppError(
      "Rapor sudah difinalisasi. Lakukan definalisasi terlebih dahulu untuk mengubah data.",
      400
    );
  }

  const result = await upsertRaporRepo({
    siswaId: input.siswaId,
    tahunAjaranId: input.tahunAjaranId,
    kelasId: penempatan.kelasId,
    waliKelasId: input.guruId,
    catatanWaliKelas: input.catatan,
    dataKokurikuler: input.kokurikuler,
  });

  return result;
};

interface GenerateRaporInput {
  guruId: string;
  siswaId: string;
  tahunAjaranId: string;
}

export const generateRaporService = async (input: GenerateRaporInput) => {
  const penempatan = await prisma.penempatanSiswa.findUnique({
    where: {
      siswaId_tahunAjaranId: {
        siswaId: input.siswaId,
        tahunAjaranId: input.tahunAjaranId,
      },
    },
    include: { kelas: true, siswa: true, tahunAjaran: true },
  });

  if (!penempatan)
    throw new AppError("Data penempatan siswa tidak ditemukan", 404);
  if (penempatan.kelas.waliKelasId !== input.guruId) {
    throw new AppError("Anda bukan Wali Kelas siswa ini", 403);
  }

  const [absensi, nilaiData, ekskulData, dataRapor] = await Promise.all([
    getAbsensiSummaryRepo(input.siswaId, input.tahunAjaranId),
    getNilaiRaporRepo(input.siswaId),
    getNilaiEkskulRepo(input.siswaId),
    getRaporDataRepo(input.siswaId, input.tahunAjaranId),
  ]);

  const mapelMap = new Map();

  nilaiData.nilaiDetails.forEach((n) => {
    const mapelName = n.mapel.namaMapel;
    if (!mapelMap.has(mapelName)) {
      mapelMap.set(mapelName, {
        kkm: 75,
        nilaiAkhir: 0,
        predikat: "",
        deskripsi: "",
      });
    }

    if (
      n.komponen?.namaKomponen === "Nilai Akhir" ||
      (n.komponen?.tipe === "READ_ONLY" && n.nilaiAngka)
    ) {
      const current = mapelMap.get(mapelName);
      current.nilaiAkhir = n.nilaiAngka || 0;
      current.predikat =
        current.nilaiAkhir >= 90 ? "A" : current.nilaiAkhir >= 80 ? "B" : "C";
    }
  });

  nilaiData.capaianDetails.forEach((c) => {});

  const nilaiAkademik = Array.from(mapelMap, ([nama, val]) => ({
    mapel: nama,
    ...val,
  }));

  const ekstrakurikuler = ekskulData.map((e) => ({
    nama: e.mapel.namaMapel,
    nilai: "A",
    deskripsi: e.nilaiDeskripsi,
  }));

  return {
    infoSiswa: {
      nama: penempatan.siswa.nama,
      nis: penempatan.siswa.nis,
      kelas: penempatan.kelas.namaKelas,
      tahunAjaran: penempatan.tahunAjaran.nama,
    },
    nilaiAkademik,
    ekstrakurikuler,
    ketidakhadiran: absensi,
    catatanWaliKelas: dataRapor?.catatanWaliKelas || "-",
    dataKokurikuler: dataRapor?.dataKokurikuler || "-",
    status: dataRapor?.isFinalisasi ? "FINAL" : "DRAFT",
    tanggalCetak: new Date(),
  };
};

interface FinalizeRaporInput {
  guruId: string;
  siswaId: string;
  tahunAjaranId: string;
}

export const finalizeRaporService = async (input: FinalizeRaporInput) => {
  const penempatan = await prisma.penempatanSiswa.findUnique({
    where: {
      siswaId_tahunAjaranId: {
        siswaId: input.siswaId,
        tahunAjaranId: input.tahunAjaranId,
      },
    },
    include: { kelas: true },
  });

  if (!penempatan)
    throw new AppError("Data penempatan siswa tidak ditemukan", 404);
  if (penempatan.kelas.waliKelasId !== input.guruId) {
    throw new AppError("Anda bukan Wali Kelas siswa ini", 403);
  }

  const rapor = await prisma.rapor.findUnique({
    where: {
      siswaId_tahunAjaranId: {
        siswaId: input.siswaId,
        tahunAjaranId: input.tahunAjaranId,
      },
    },
  });

  if (!rapor)
    throw new AppError(
      "Data rapor belum diinisialisasi (belum ada catatan/kokurikuler).",
      400
    );
  if (!rapor.catatanWaliKelas || !rapor.dataKokurikuler) {
    throw new AppError(
      "Catatan Wali Kelas dan Data Kokurikuler wajib diisi sebelum finalisasi.",
      400
    );
  }

  return await prisma.rapor.update({
    where: { id: rapor.id },
    data: { isFinalisasi: true },
  });
};

export const definalizeRaporService = async (input: FinalizeRaporInput) => {
  const penempatan = await prisma.penempatanSiswa.findUnique({
    where: {
      siswaId_tahunAjaranId: {
        siswaId: input.siswaId,
        tahunAjaranId: input.tahunAjaranId,
      },
    },
    include: { kelas: true },
  });

  if (!penempatan)
    throw new AppError("Data penempatan siswa tidak ditemukan", 404);
  if (penempatan.kelas.waliKelasId !== input.guruId) {
    throw new AppError("Anda bukan Wali Kelas siswa ini", 403);
  }

  const rapor = await prisma.rapor.findUnique({
    where: {
      siswaId_tahunAjaranId: {
        siswaId: input.siswaId,
        tahunAjaranId: input.tahunAjaranId,
      },
    },
  });

  if (!rapor) throw new AppError("Data rapor tidak ditemukan.", 404);

  return await prisma.rapor.update({
    where: { id: rapor.id },
    data: { isFinalisasi: false },
  });
};

interface OverrideNilaiInput {
  adminId: string;
  siswaId: string;
  mapelId: string;
  tahunAjaranId: string;
  nilaiAkhir: number;
}

export const overrideNilaiRaporService = async (input: OverrideNilaiInput) => {
  const rapor = await prisma.rapor.findUnique({
    where: {
      siswaId_tahunAjaranId: {
        siswaId: input.siswaId,
        tahunAjaranId: input.tahunAjaranId,
      },
    },
  });

  if (!rapor)
    throw new AppError(
      "Rapor siswa belum dibuat. Harap minta Wali Kelas mengisi data awal terlebih dahulu.",
      404
    );

  return await prisma.nilaiRaporAkhir.upsert({
    where: {
      raporId_mapelId: {
        raporId: rapor.id,
        mapelId: input.mapelId,
      },
    },
    update: {
      nilaiAkhir: input.nilaiAkhir,
      isOverride: true,
    },
    create: {
      raporId: rapor.id,
      mapelId: input.mapelId,
      nilaiAkhir: input.nilaiAkhir,
      isOverride: true,
    },
  });
};

export const getMyRaporService = async (siswaId: string) => {
  logger.info(`Fetching reports for student: ${siswaId}`);
  const rapors = await getRaporBySiswaIdRepo(siswaId);
  return rapors;
};
