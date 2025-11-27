import { prisma } from "../config/prisma";
import { AbsensiStatus } from "../generated/prisma";

interface InputRaporData {
  siswaId: string;
  tahunAjaranId: string;
  kelasId: string;
  waliKelasId: string;
  catatanWaliKelas?: string;
  dataKokurikuler?: string;
}

export const upsertRaporRepo = async (data: InputRaporData) => {
  return prisma.rapor.upsert({
    where: {
      siswaId_tahunAjaranId: {
        siswaId: data.siswaId,
        tahunAjaranId: data.tahunAjaranId,
      },
    },
    update: {
      catatanWaliKelas: data.catatanWaliKelas,
      dataKokurikuler: data.dataKokurikuler,
      kelasId: data.kelasId,
      waliKelasId: data.waliKelasId,
    },
    create: {
      siswaId: data.siswaId,
      tahunAjaranId: data.tahunAjaranId,
      kelasId: data.kelasId,
      waliKelasId: data.waliKelasId,
      catatanWaliKelas: data.catatanWaliKelas,
      dataKokurikuler: data.dataKokurikuler,
      isFinalisasi: false,
    },
  });
};

export const getAbsensiSummaryRepo = async (
  siswaId: string,
  tahunAjaranId: string
) => {
  const absensi = await prisma.absensiDetail.findMany({
    where: {
      siswaId: siswaId,
      sesi: {},
    },
  });

  const summary = {
    [AbsensiStatus.SAKIT]: 0,
    [AbsensiStatus.IZIN]: 0,
    [AbsensiStatus.ALPHA]: 0,
    [AbsensiStatus.HADIR]: 0,
  };

  absensi.forEach((a) => {
    summary[a.status]++;
  });

  return summary;
};

export const getNilaiRaporRepo = async (siswaId: string) => {
  const nilaiDetails = await prisma.nilaiDetailSiswa.findMany({
    where: { siswaId: siswaId, mapel: { kategori: "WAJIB" } },
    include: {
      mapel: true,
      komponen: true,
    },
  });

  const capaianDetails = await prisma.capaianKompetensi.findMany({
    where: { siswaId: siswaId },
  });

  return { nilaiDetails, capaianDetails };
};

export const getNilaiEkskulRepo = async (siswaId: string) => {
  return prisma.nilaiDetailSiswa.findMany({
    where: {
      siswaId: siswaId,
      mapel: { kategori: "EKSTRAKURIKULER" },
      komponenId: null,
    },
    include: { mapel: true },
  });
};

export const getRaporDataRepo = async (
  siswaId: string,
  tahunAjaranId: string
) => {
  return prisma.rapor.findUnique({
    where: { siswaId_tahunAjaranId: { siswaId, tahunAjaranId } },
    include: { waliKelas: true },
  });
};

export const getRaporBySiswaIdRepo = async (siswaId: string) => {
  return await prisma.rapor.findMany({
    where: { siswaId, isFinalisasi: true },
    include: {
      tahunAjaran: true,
      kelas: true,
      waliKelas: true,
      NilaiRaporAkhir: {
        include: {
          mapel: true,
        },
      },
    },
    orderBy: {
      tahunAjaran: { nama: "desc" },
    },
  });
};
