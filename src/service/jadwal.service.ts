import { createJadwalRepo } from "../repositories/jadwal.repository";
import logger from "../utils/logger";
import AppError from "../utils/AppError";
import { prisma } from "../config/prisma";

interface CreateJadwalServiceInput {
  tahunAjaranId: string;
  kelasId: string;
  mapelId: string;
  guruId: string;
  ruanganId: string;
  hari: string;
  waktuMulai: string;
  waktuSelesai: string;
}

export const createJadwalService = async (data: CreateJadwalServiceInput) => {
  logger.info(`Mencoba membuat jadwal baru...`);

  // --- Logika Bisnis 1: Cek Penugasan Guru ---
  // Pastikan guru ini memang ditugaskan mengajar mapel ini di kelas ini
  const penugasan = await prisma.penugasanGuru.findUnique({
    where: {
      guruId_mapelId_kelasId: {
        guruId: data.guruId,
        mapelId: data.mapelId,
        kelasId: data.kelasId,
      },
    },
  });

  if (!penugasan) {
    throw new AppError(
      "Penugasan Guru untuk Mapel dan Kelas ini tidak ditemukan. Harap buat penugasan terlebih dahulu.",
      404,
    );
  }

  // --- Logika Bisnis 2: Cek dependensi lain (TA & Ruangan) ---
  const [tahunAjaran, ruangan] = await Promise.all([
    prisma.tahunAjaran.findUnique({ where: { id: data.tahunAjaranId } }),
    prisma.ruangan.findUnique({ where: { id: data.ruanganId } }),
  ]);

  if (!tahunAjaran) throw new AppError("Tahun Ajaran tidak ditemukan", 404);
  if (!ruangan) throw new AppError("Ruangan tidak ditemukan", 404);

  // TODO: Logika Bisnis 3 (Advanced)
  // Cek konflik jadwal (apakah guru/ruangan/kelas sudah dipakai di jam itu)
  // Ini kompleks karena 'waktuMulai' dan 'waktuSelesai' adalah string.
  // Untuk V1, kita skip dulu.

  // --- Panggil Repository ---
  const newJadwal = await createJadwalRepo(data);

  return newJadwal;
};