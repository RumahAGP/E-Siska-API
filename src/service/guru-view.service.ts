import { prisma } from "../config/prisma";
import AppError from "../utils/AppError";
import logger from "../utils/logger";

export const getMyJadwalGuruService = async (guruId: string) => {
  logger.info(`Fetching schedule for guru: ${guruId}`);

  const jadwal = await prisma.jadwal.findMany({
    where: {
      guruId: guruId,
    },
    include: {
      mapel: true,
      kelas: {
        include: {
          tingkatan: true,
        },
      },
      ruangan: true,
      tahunAjaran: true,
    },
    orderBy: [{ hari: "asc" }, { waktuMulai: "asc" }],
  });

  return jadwal;
};

export const getPengumumanGuruService = async () => {
  logger.info("Fetching pengumuman for guru");

  const pengumuman = await prisma.pengumuman.findMany({
    orderBy: {
      tanggalPublikasi: "desc",
    },
    take: 50,
  });

  return pengumuman;
};

export const getDokumenGuruService = async () => {
  logger.info("Fetching dokumen for guru");

  const dokumen = await prisma.dokumen.findMany({
    select: {
      id: true,
      judul: true,
      urlFile: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return dokumen;
};
