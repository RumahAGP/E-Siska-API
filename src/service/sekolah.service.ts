import { prisma } from "../config/prisma";
import AppError from "../utils/AppError";
import logger from "../utils/logger";

interface SekolahDataInput {
  namaSekolah: string;
  alamat?: string;
  kepalaSekolah?: string;
}

export const getSekolahDataService = async () => {
  logger.info("Fetching school data");

  const sekolah = await prisma.sekolahData.findFirst();

  if (!sekolah) {
    throw new AppError("Data sekolah belum diatur", 404);
  }

  return sekolah;
};

export const upsertSekolahDataService = async (
  data: SekolahDataInput,
  adminId: string
) => {
  logger.info("Upserting school data");

  const existing = await prisma.sekolahData.findFirst();

  if (existing) {
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

export const deleteSekolahDataService = async () => {
  logger.info("Deleting school data");

  const existing = await prisma.sekolahData.findFirst();

  if (!existing) {
    throw new AppError("Data sekolah tidak ditemukan", 404);
  }

  await prisma.sekolahData.delete({
    where: { id: existing.id },
  });

  return { message: "Data sekolah berhasil dihapus" };
};
