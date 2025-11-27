import {
  createPenempatanRepo,
  findPenempatanBySiswaAndTahun,
} from "../repositories/penempatan.repository";
import logger from "../utils/logger";
import AppError from "../utils/AppError";
import { prisma } from "../config/prisma";

interface CreatePenempatanServiceInput {
  siswaId: string;
  kelasId: string;
  tahunAjaranId: string;
}

export const createPenempatanService = async (
  data: CreatePenempatanServiceInput
) => {
  logger.info(
    `Mencoba menempatkan siswa ${data.siswaId} ke kelas ${data.kelasId}`
  );

  const [siswa, kelas, tahunAjaran] = await Promise.all([
    prisma.siswa.findUnique({ where: { id: data.siswaId } }),
    prisma.kelas.findUnique({ where: { id: data.kelasId } }),
    prisma.tahunAjaran.findUnique({ where: { id: data.tahunAjaranId } }),
  ]);

  if (!siswa) throw new AppError("Siswa tidak ditemukan", 404);
  if (!kelas) throw new AppError("Kelas tidak ditemukan", 404);
  if (!tahunAjaran) throw new AppError("Tahun Ajaran tidak ditemukan", 404);

  const existingPenempatan = await findPenempatanBySiswaAndTahun(
    data.siswaId,
    data.tahunAjaranId
  );

  if (existingPenempatan) {
    throw new AppError(
      `Siswa ini sudah ditempatkan di kelas lain pada tahun ajaran ${tahunAjaran.nama}`,
      409
    );
  }

  const newPenempatan = await createPenempatanRepo(data);

  return newPenempatan;
};

export const getAllPenempatanService = async (filters?: {
  tahunAjaranId?: string;
  kelasId?: string;
  siswaId?: string;
}) => {
  logger.info("Fetching all penempatan");

  const penempatan = await prisma.penempatanSiswa.findMany({
    where: {
      ...(filters?.tahunAjaranId && { tahunAjaranId: filters.tahunAjaranId }),
      ...(filters?.kelasId && { kelasId: filters.kelasId }),
      ...(filters?.siswaId && { siswaId: filters.siswaId }),
    },
    include: {
      siswa: true,
      kelas: {
        include: {
          tingkatan: true,
        },
      },
      tahunAjaran: true,
    },
    orderBy: {
      siswa: {
        nama: "asc",
      },
    },
  });

  return penempatan;
};

export const getPenempatanByIdService = async (id: string) => {
  logger.info(`Fetching penempatan: ${id}`);

  const penempatan = await prisma.penempatanSiswa.findUnique({
    where: { id },
    include: {
      siswa: true,
      kelas: {
        include: {
          tingkatan: true,
        },
      },
      tahunAjaran: true,
    },
  });

  if (!penempatan) {
    throw new AppError("Penempatan tidak ditemukan", 404);
  }

  return penempatan;
};

export const updatePenempatanService = async (
  id: string,
  data: Partial<CreatePenempatanServiceInput>
) => {
  logger.info(`Updating penempatan: ${id}`);

  const penempatan = await prisma.penempatanSiswa.findUnique({
    where: { id },
  });

  if (!penempatan) {
    throw new AppError("Penempatan tidak ditemukan", 404);
  }

  const updated = await prisma.penempatanSiswa.update({
    where: { id },
    data: {
      ...(data.siswaId && { siswaId: data.siswaId }),
      ...(data.kelasId && { kelasId: data.kelasId }),
      ...(data.tahunAjaranId && { tahunAjaranId: data.tahunAjaranId }),
    },
  });

  return updated;
};

export const deletePenempatanService = async (id: string) => {
  logger.info(`Deleting penempatan: ${id}`);

  const penempatan = await prisma.penempatanSiswa.findUnique({
    where: { id },
  });

  if (!penempatan) {
    throw new AppError("Penempatan tidak ditemukan", 404);
  }

  await prisma.penempatanSiswa.delete({
    where: { id },
  });

  return { message: "Penempatan berhasil dihapus" };
};
