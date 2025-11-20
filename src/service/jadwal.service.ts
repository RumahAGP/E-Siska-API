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

  const [tahunAjaran, ruangan] = await Promise.all([
    prisma.tahunAjaran.findUnique({ where: { id: data.tahunAjaranId } }),
    prisma.ruangan.findUnique({ where: { id: data.ruanganId } }),
  ]);

  if (!tahunAjaran) throw new AppError("Tahun Ajaran tidak ditemukan", 404);
  if (!ruangan) throw new AppError("Ruangan tidak ditemukan", 404);

  const newJadwal = await createJadwalRepo(data);

  return newJadwal;
};

/**
 * Get all jadwal with filters
 */
export const getAllJadwalService = async (filters?: {
  tahunAjaranId?: string;
  kelasId?: string;
  guruId?: string;
}) => {
  logger.info('Fetching all jadwal');

  const jadwal = await prisma.jadwal.findMany({
    where: {
      ...(filters?.tahunAjaranId && { tahunAjaranId: filters.tahunAjaranId }),
      ...(filters?.kelasId && { kelasId: filters.kelasId }),
      ...(filters?.guruId && { guruId: filters.guruId }),
    },
    include: {
      mapel: true,
      guru: true,
      kelas: {
        include: {
          tingkatan: true,
        },
      },
      ruangan: true,
      tahunAjaran: true,
    },
    orderBy: [
      { hari: 'asc' },
      { waktuMulai: 'asc' },
    ],
  });

  return jadwal;
};

/**
 * Get jadwal by ID
 */
export const getJadwalByIdService = async (id: string) => {
  logger.info(`Fetching jadwal: ${id}`);

  const jadwal = await prisma.jadwal.findUnique({
    where: { id },
    include: {
      mapel: true,
      guru: true,
      kelas: {
        include: {
          tingkatan: true,
        },
      },
      ruangan: true,
      tahunAjaran: true,
    },
  });

  if (!jadwal) {
    throw new AppError("Jadwal tidak ditemukan", 404);
  }

  return jadwal;
};

/**
 * Update jadwal
 */
export const updateJadwalService = async (id: string, data: Partial<CreateJadwalServiceInput>) => {
  logger.info(`Updating jadwal: ${id}`);

  const jadwal = await prisma.jadwal.findUnique({
    where: { id },
  });

  if (!jadwal) {
    throw new AppError("Jadwal tidak ditemukan", 404);
  }

  const updated = await prisma.jadwal.update({
    where: { id },
    data: {
      ...(data.tahunAjaranId && { tahunAjaranId: data.tahunAjaranId }),
      ...(data.kelasId && { kelasId: data.kelasId }),
      ...(data.mapelId && { mapelId: data.mapelId }),
      ...(data.guruId && { guruId: data.guruId }),
      ...(data.ruanganId && { ruanganId: data.ruanganId }),
      ...(data.hari && { hari: data.hari }),
      ...(data.waktuMulai && { waktuMulai: data.waktuMulai }),
      ...(data.waktuSelesai && { waktuSelesai: data.waktuSelesai }),
    },
  });

  return updated;
};

/**
 * Delete jadwal
 */
export const deleteJadwalService = async (id: string) => {
  logger.info(`Deleting jadwal: ${id}`);

  const jadwal = await prisma.jadwal.findUnique({
    where: { id },
  });

  if (!jadwal) {
    throw new AppError("Jadwal tidak ditemukan", 404);
  }

  await prisma.jadwal.delete({
    where: { id },
  });

  return { message: "Jadwal berhasil dihapus" };
};