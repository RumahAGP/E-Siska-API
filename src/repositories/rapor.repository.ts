import { prisma } from "../config/prisma";

interface InputRaporData {
  siswaId: string;
  tahunAjaranId: string;
  kelasId: string;
  waliKelasId: string;
  catatanWaliKelas?: string;
  dataKokurikuler?: string;
}

/**
 * Update atau Buat Data Rapor (Catatan & Kokurikuler)
 */
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
      // Pastikan data relasi tetap sinkron jika update
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
      finalGrades: {}, // JSON kosong awal
    },
  });
};