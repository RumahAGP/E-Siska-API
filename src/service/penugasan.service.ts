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

  const [guru, mapel, kelas] = await Promise.all([
    prisma.guru.findUnique({ where: { id: data.guruId } }),
    prisma.mataPelajaran.findUnique({ where: { id: data.mapelId } }),
    prisma.kelas.findUnique({ where: { id: data.kelasId } }),
  ]);

  if (!guru) throw new AppError("Guru tidak ditemukan", 404);
  if (!mapel) throw new AppError("Mata Pelajaran tidak ditemukan", 404);
  if (!kelas) throw new AppError("Kelas tidak ditemukan", 404);

  const existingPenugasan = await findPenugasanUnik(
    data.guruId,
    data.mapelId,
    data.kelasId,
  );

  if (existingPenugasan) {
    throw new AppError(
      `Guru ${guru.nama} sudah ditugaskan untuk mapel ${mapel.namaMapel} di kelas ${kelas.namaKelas}`,
      409,
    );
  }

  const newPenugasan = await createPenugasanRepo(data);

  return newPenugasan;
};

/**
 * Get all penugasan with filters
 */
export const getAllPenugasanService = async (filters?: {
  guruId?: string;
  mapelId?: string;
  kelasId?: string;
}) => {
  logger.info('Fetching all penugasan');

  const penugasan = await prisma.penugasanGuru.findMany({
    where: {
      ...(filters?.guruId && { guruId: filters.guruId }),
      ...(filters?.mapelId && { mapelId: filters.mapelId }),
      ...(filters?.kelasId && { kelasId: filters.kelasId }),
    },
    include: {
      guru: true,
      mapel: true,
      kelas: {
        include: {
          tingkatan: true,
        },
      },
    },
    orderBy: {
      guru: {
        nama: 'asc',
      },
    },
  });

  return penugasan;
};

/**
 * Get penugasan by ID
 */
export const getPenugasanByIdService = async (id: string) => {
  logger.info(`Fetching penugasan: ${id}`);

  const penugasan = await prisma.penugasanGuru.findUnique({
    where: { id },
    include: {
      guru: true,
      mapel: true,
      kelas: {
        include: {
          tingkatan: true,
        },
      },
    },
  });

  if (!penugasan) {
    throw new AppError("Penugasan tidak ditemukan", 404);
  }

  return penugasan;
};

/**
 * Update penugasan
 */
export const updatePenugasanService = async (id: string, data: Partial<CreatePenugasanServiceInput>) => {
  logger.info(`Updating penugasan: ${id}`);

  const penugasan = await prisma.penugasanGuru.findUnique({
    where: { id },
  });

  if (!penugasan) {
    throw new AppError("Penugasan tidak ditemukan", 404);
  }

  const updated = await prisma.penugasanGuru.update({
    where: { id },
    data: {
      ...(data.guruId && { guruId: data.guruId }),
      ...(data.mapelId && { mapelId: data.mapelId }),
      ...(data.kelasId && { kelasId: data.kelasId }),
    },
  });

  return updated;
};

/**
 * Delete penugasan
 */
export const deletePenugasanService = async (id: string) => {
  logger.info(`Deleting penugasan: ${id}`);

  const penugasan = await prisma.penugasanGuru.findUnique({
    where: { id },
  });

  if (!penugasan) {
    throw new AppError("Penugasan tidak ditemukan", 404);
  }

  await prisma.penugasanGuru.delete({
    where: { id },
  });

  return { message: "Penugasan berhasil dihapus" };
};