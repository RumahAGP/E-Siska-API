import { prisma } from "../config/prisma";
import { createTahunAjaranRepo } from "../repositories/tahunAjaran.repository";
import logger from "../utils/logger";
import AppError from "../utils/AppError";

interface CreateTahunAjaranInput {
  nama: string;
}

export const createTahunAjaranService = async (data: CreateTahunAjaranInput) => {
  logger.info(`Creating tahun ajaran: ${data.nama}`);

  // TODO: Get adminId from authenticated user
  const ADMIN_ID_DUMMY = (await prisma.admin.findFirst())?.id || "dummy-admin-id";

  const newTahunAjaran = await createTahunAjaranRepo({
    nama: data.nama,
    adminId: ADMIN_ID_DUMMY,
  });

  return newTahunAjaran;
};

/**
 * Get all tahun ajaran
 */
export const getAllTahunAjaranService = async () => {
  logger.info('Fetching all tahun ajaran');

  const tahunAjaran = await prisma.tahunAjaran.findMany({
    orderBy: {
      nama: 'desc',
    },
  });

  return tahunAjaran;
};

/**
 * Get tahun ajaran by ID
 */
export const getTahunAjaranByIdService = async (id: string) => {
  logger.info(`Fetching tahun ajaran: ${id}`);

  const tahunAjaran = await prisma.tahunAjaran.findUnique({
    where: { id },
  });

  if (!tahunAjaran) {
    throw new AppError("Tahun ajaran tidak ditemukan", 404);
  }

  return tahunAjaran;
};

/**
 * Update tahun ajaran
 */
export const updateTahunAjaranService = async (id: string, data: Partial<CreateTahunAjaranInput>) => {
  logger.info(`Updating tahun ajaran: ${id}`);

  const tahunAjaran = await prisma.tahunAjaran.findUnique({
    where: { id },
  });

  if (!tahunAjaran) {
    throw new AppError("Tahun ajaran tidak ditemukan", 404);
  }

  const updated = await prisma.tahunAjaran.update({
    where: { id },
    data: {
      ...(data.nama && { nama: data.nama }),
    },
  });

  return updated;
};

/**
 * Activate tahun ajaran (set as active, deactivate others)
 */
export const activateTahunAjaranService = async (id: string) => {
  logger.info(`Activating tahun ajaran: ${id}`);

  const tahunAjaran = await prisma.tahunAjaran.findUnique({
    where: { id },
  });

  if (!tahunAjaran) {
    throw new AppError("Tahun ajaran tidak ditemukan", 404);
  }

  // Deactivate all first
  await prisma.tahunAjaran.updateMany({
    data: { isAktif: false },
  });

  // Activate the selected one
  const activated = await prisma.tahunAjaran.update({
    where: { id },
    data: { isAktif: true },
  });

  return activated;
};

/**
 * Delete tahun ajaran
 */
export const deleteTahunAjaranService = async (id: string) => {
  logger.info(`Deleting tahun ajaran: ${id}`);

  const tahunAjaran = await prisma.tahunAjaran.findUnique({
    where: { id },
  });

  if (!tahunAjaran) {
    throw new AppError("Tahun ajaran tidak ditemukan", 404);
  }

  // Check if active
  if (tahunAjaran.isAktif) {
    throw new AppError("Tidak dapat menghapus tahun ajaran yang sedang aktif", 400);
  }

  await prisma.tahunAjaran.delete({
    where: { id },
  });

  return { message: "Tahun ajaran berhasil dihapus" };
};

export const getActiveTahunAjaranService = async () => {
  logger.info('Fetching active tahun ajaran');
  
  const active = await prisma.tahunAjaran.findFirst({
    where: { isAktif: true }
  });

  if (!active) {
    throw new AppError("Tidak ada tahun ajaran yang aktif saat ini.", 404);
  }

  return active;
};