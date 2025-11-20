import { prisma } from "../config/prisma";
import AppError from "../utils/AppError";
import logger from "../utils/logger";

interface SekolahDataInput {
  namaSekolah: string;
  alamat?: string;
  kepalaSekolah?: string;
}

/**
 * Get school data (singleton - only one record)
 */
export const getSekolahDataService = async () => {
  logger.info('Fetching school data');

  const sekolah = await prisma.sekolahData.findFirst();

  if (!sekolah) {
    throw new AppError("Data sekolah belum diatur", 404);
  }

  return sekolah;
};

/**
 * Create or Update school data (upsert)
 */
export const upsertSekolahDataService = async (data: SekolahDataInput, adminId: string) => {
  logger.info('Upserting school data');

  // Check if data exists
  const existing = await prisma.sekolahData.findFirst();

  if (existing) {
    // Update existing
    const updated = await prisma.sekolahData.update({
      where: { id: existing.id },
      data: {
        namaSekolah: data.namaSekolah,
        alamat: data.alamat,
        kepalaSekolah: data.kepalaSekolah,
      },
    });

    logger.info(`School data updated: ${updated.id}`);
    return updated;
  } else {
    // Create new
    const newSekolah = await prisma.sekolahData.create({
      data: {
        adminId: adminId,
        namaSekolah: data.namaSekolah,
        alamat: data.alamat,
        kepalaSekolah: data.kepalaSekolah,
      },
    });

    logger.info(`School data created: ${newSekolah.id}`);
    return newSekolah;
  }
};

/**
 * Delete school data
 */
export const deleteSekolahDataService = async () => {
  logger.info('Deleting school data');

  const existing = await prisma.sekolahData.findFirst();

  if (!existing) {
    throw new AppError("Data sekolah tidak ditemukan", 404);
  }

  await prisma.sekolahData.delete({
    where: { id: existing.id },
  });

  return { message: "Data sekolah berhasil dihapus" };
};
