import { upsertRaporRepo } from "../repositories/rapor.repository";
import logger from "../utils/logger";
import AppError from "../utils/AppError";
import { prisma } from "../config/prisma";

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

  // 3. Cek Status Finalisasi (Opsional, tapi disarankan)
  // Jika rapor sudah difinalisasi, seharusnya tidak bisa diedit lagi kecuali didefinalisasi.
  const existingRapor = await prisma.rapor.findUnique({
      where: { siswaId_tahunAjaranId: { siswaId: input.siswaId, tahunAjaranId: input.tahunAjaranId } }
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