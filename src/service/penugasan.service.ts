import {
  createPenugasanRepo,
  findPenugasanUnik,
} from "../repositories/penugasan.repository";
import logger from "../utils/logger";
import AppError from "../utils/AppError";
import { prisma } from "../config/prisma";

interface CreatePenugasanServiceInput {
  guruId: string;
  mapelId: string;
  kelasId: string;
}

export const createPenugasanService = async (
  data: CreatePenugasanServiceInput,
) => {
  logger.info(`Mencoba membuat penugasan baru...`);

  // --- Logika Bisnis 1: Cek dependensi ---
  // Pastikan Guru, Mapel, dan Kelas ada
  const [guru, mapel, kelas] = await Promise.all([
    prisma.guru.findUnique({ where: { id: data.guruId } }),
    prisma.mataPelajaran.findUnique({ where: { id: data.mapelId } }),
    prisma.kelas.findUnique({ where: { id: data.kelasId } }),
  ]);

  if (!guru) throw new AppError("Guru tidak ditemukan", 404);
  if (!mapel) throw new AppError("Mata Pelajaran tidak ditemukan", 404);
  if (!kelas) throw new AppError("Kelas tidak ditemukan", 404);

  // --- Logika Bisnis 2: Cek Aturan Unik ---
  const existingPenugasan = await findPenugasanUnik(
    data.guruId,
    data.mapelId,
    data.kelasId,
  );

  if (existingPenugasan) {
    throw new AppError(
      `Guru ${guru.nama} sudah ditugaskan untuk mapel ${mapel.namaMapel} di kelas ${kelas.namaKelas}`,
      409, // 409 Conflict
    );
  }

  // --- Panggil Repository ---
  const newPenugasan = await createPenugasanRepo(data);

  return newPenugasan;
};