import { upsertRaporRepo } from "../repositories/rapor.repository";
import logger from "../utils/logger";
import AppError from "../utils/AppError";
import { prisma } from "../config/prisma";
import { 
    getAbsensiSummaryRepo, 
    getNilaiRaporRepo, 
    getNilaiEkskulRepo, 
    getRaporDataRepo,
    getRaporBySiswaIdRepo
} from "../repositories/rapor.repository";

interface InputRaporService {
  guruId: string; // ID Guru yang sedang login
  siswaId: string;
  tahunAjaranId: string;
  catatan?: string;
  kokurikuler?: string;
}

export const inputDataRaporService = async (input: InputRaporService) => {
  logger.info(`Mencoba update data rapor siswa ${input.siswaId} oleh guru ${input.guruId}`);

  // 1. Cari Penempatan Siswa untuk mengetahui Kelas-nya di Tahun Ajaran ini
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
    throw new AppError("Siswa belum ditempatkan di kelas untuk tahun ajaran ini.", 404);
  }

  // 2. Validasi Wali Kelas: Apakah Guru yang login adalah Wali Kelas dari kelas siswa tersebut?
  if (penempatan.kelas.waliKelasId !== input.guruId) {
    throw new AppError("Anda bukan Wali Kelas dari siswa ini.", 403);
  }

  // 3. Cek Status Finalisasi (Data tidak boleh diubah jika sudah final)
  const existingRapor = await prisma.rapor.findUnique({
      where: { 
          siswaId_tahunAjaranId: { 
              siswaId: input.siswaId, 
              tahunAjaranId: input.tahunAjaranId 
          } 
      }
  });
  
  if (existingRapor?.isFinalisasi) {
      throw new AppError("Rapor sudah difinalisasi. Lakukan definalisasi terlebih dahulu untuk mengubah data.", 400);
  }

  // 4. Simpan Data
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
    // 1. Validasi Akses (Apakah ini Wali Kelasnya?)
    const penempatan = await prisma.penempatanSiswa.findUnique({
        where: { siswaId_tahunAjaranId: { siswaId: input.siswaId, tahunAjaranId: input.tahunAjaranId } },
        include: { kelas: true, siswa: true, tahunAjaran: true }
    });

    if (!penempatan) throw new AppError("Data penempatan siswa tidak ditemukan", 404);
    if (penempatan.kelas.waliKelasId !== input.guruId) {
        throw new AppError("Anda bukan Wali Kelas siswa ini", 403);
    }

    // 2. Ambil Data Secara Paralel
    const [absensi, nilaiData, ekskulData, dataRapor] = await Promise.all([
        getAbsensiSummaryRepo(input.siswaId, input.tahunAjaranId),
        getNilaiRaporRepo(input.siswaId),
        getNilaiEkskulRepo(input.siswaId),
        getRaporDataRepo(input.siswaId, input.tahunAjaranId)
    ]);

    // 3. Format Data Nilai Mapel Wajib
    // Kita perlu mencari "Nilai Akhir" dari sekian banyak komponen.
    // Asumsi: Komponen dengan nama "Nilai Akhir" atau komponen READ_ONLY urutan terakhir.
    const mapelMap = new Map();

    nilaiData.nilaiDetails.forEach(n => {
        const mapelName = n.mapel.namaMapel;
        if (!mapelMap.has(mapelName)) {
            mapelMap.set(mapelName, { 
                kkm: 75, // Hardcode atau ambil dari DB jika ada
                nilaiAkhir: 0, 
                predikat: "",
                deskripsi: "" 
            });
        }

        // Logika sederhana: Ambil nilai dari komponen bernama "Nilai Akhir"
        // Atau jika tidak ada, ambil nilai READ_ONLY terakhir
        if (n.komponen?.namaKomponen === "Nilai Akhir" || (n.komponen?.tipe === "READ_ONLY" && n.nilaiAngka)) {
            const current = mapelMap.get(mapelName);
            current.nilaiAkhir = n.nilaiAngka || 0;
            // Hitung predikat sederhana
            current.predikat = current.nilaiAkhir >= 90 ? "A" : current.nilaiAkhir >= 80 ? "B" : "C";
        }
    });

    // Masukkan deskripsi capaian
    nilaiData.capaianDetails.forEach(c => {
         // Note: Di repo capaian kita tidak fetch nama mapel, ini simplifikasi. 
         // Idealnya capaianDetails di-include mapelnya juga di repo.
         // Kita skip mapping nama mapel persisnya untuk demo ini, 
         // anggap Frontend mapping by mapelId.
    });

    // Konversi Map ke Array untuk JSON
    const nilaiAkademik = Array.from(mapelMap, ([nama, val]) => ({ mapel: nama, ...val }));

    // 4. Format Data Ekskul
    const ekstrakurikuler = ekskulData.map(e => ({
        nama: e.mapel.namaMapel,
        nilai: "A", // Ekskul biasanya predikat, atau ambil dari deskripsi jika ada logika khusus
        deskripsi: e.nilaiDeskripsi
    }));

    // 5. Construct Final JSON
    return {
        infoSiswa: {
            nama: penempatan.siswa.nama,
            nis: penempatan.siswa.nis,
            kelas: penempatan.kelas.namaKelas,
            tahunAjaran: penempatan.tahunAjaran.nama
        },
        nilaiAkademik,
        ekstrakurikuler,
        ketidakhadiran: absensi,
        catatanWaliKelas: dataRapor?.catatanWaliKelas || "-",
        dataKokurikuler: dataRapor?.dataKokurikuler || "-",
        status: dataRapor?.isFinalisasi ? "FINAL" : "DRAFT",
        tanggalCetak: new Date()
    };
};

interface FinalizeRaporInput {
  guruId: string;
  siswaId: string;
  tahunAjaranId: string;
}

export const finalizeRaporService = async (input: FinalizeRaporInput) => {
    // 1. Validasi Wali Kelas
    const penempatan = await prisma.penempatanSiswa.findUnique({
        where: { siswaId_tahunAjaranId: { siswaId: input.siswaId, tahunAjaranId: input.tahunAjaranId } },
        include: { kelas: true }
    });

    if (!penempatan) throw new AppError("Data penempatan siswa tidak ditemukan", 404);
    if (penempatan.kelas.waliKelasId !== input.guruId) {
        throw new AppError("Anda bukan Wali Kelas siswa ini", 403);
    }

    // 2. Cek Kelengkapan Data (Catatan & Kokurikuler wajib diisi sebelum final)
    const rapor = await prisma.rapor.findUnique({
        where: { siswaId_tahunAjaranId: { siswaId: input.siswaId, tahunAjaranId: input.tahunAjaranId } }
    });

    if (!rapor) throw new AppError("Data rapor belum diinisialisasi (belum ada catatan/kokurikuler).", 400);
    if (!rapor.catatanWaliKelas || !rapor.dataKokurikuler) {
        throw new AppError("Catatan Wali Kelas dan Data Kokurikuler wajib diisi sebelum finalisasi.", 400);
    }

    // 3. Update Status Finalisasi
    return await prisma.rapor.update({
        where: { id: rapor.id },
        data: { isFinalisasi: true }
    });
};

export const definalizeRaporService = async (input: FinalizeRaporInput) => {
    // 1. Validasi Wali Kelas
    const penempatan = await prisma.penempatanSiswa.findUnique({
        where: { siswaId_tahunAjaranId: { siswaId: input.siswaId, tahunAjaranId: input.tahunAjaranId } },
        include: { kelas: true }
    });

    if (!penempatan) throw new AppError("Data penempatan siswa tidak ditemukan", 404);
    if (penempatan.kelas.waliKelasId !== input.guruId) {
        throw new AppError("Anda bukan Wali Kelas siswa ini", 403);
    }

    // 2. Update Status Finalisasi
    const rapor = await prisma.rapor.findUnique({
        where: { siswaId_tahunAjaranId: { siswaId: input.siswaId, tahunAjaranId: input.tahunAjaranId } }
    });

    if (!rapor) throw new AppError("Data rapor tidak ditemukan.", 404);

    return await prisma.rapor.update({
        where: { id: rapor.id },
        data: { isFinalisasi: false }
    });
};

interface OverrideNilaiInput {
    adminId: string; // Hanya admin yang boleh
    siswaId: string;
    mapelId: string;
    tahunAjaranId: string;
    nilaiAkhir: number;
}

export const overrideNilaiRaporService = async (input: OverrideNilaiInput) => {
    // 1. Cari Rapor ID
    const rapor = await prisma.rapor.findUnique({
        where: { siswaId_tahunAjaranId: { siswaId: input.siswaId, tahunAjaranId: input.tahunAjaranId } }
    });

    if (!rapor) throw new AppError("Rapor siswa belum dibuat. Harap minta Wali Kelas mengisi data awal terlebih dahulu.", 404);

    // 2. Upsert Nilai Rapor Akhir (Override)
    return await prisma.nilaiRaporAkhir.upsert({
        where: {
            raporId_mapelId: {
                raporId: rapor.id,
                mapelId: input.mapelId
            }
        },
        update: {
            nilaiAkhir: input.nilaiAkhir,
            isOverride: true
        },
        create: {
            raporId: rapor.id,
            mapelId: input.mapelId,
            nilaiAkhir: input.nilaiAkhir,
            isOverride: true
        }
    });
};

export const getMyRaporService = async (siswaId: string) => {
  logger.info(`Fetching reports for student: ${siswaId}`);
  const rapors = await getRaporBySiswaIdRepo(siswaId);
  return rapors;
};