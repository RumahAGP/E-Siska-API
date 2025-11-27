import {
  createKelasRepo,
  updateKelasRepo,
  deleteKelasRepo,
  findAllKelasRepo,
  getKelasByWaliKelasRepo,
  getKelasByGuruIdRepo,
} from "../repositories/kelas.repository";
import logger from "../utils/logger";
import AppError from "../utils/AppError";
import { prisma } from "../config/prisma";

interface CreateKelasServiceInput {
  namaKelas: string;
  tingkatanId: string;
  waliKelasId?: string;
}

export const createKelasService = async (data: CreateKelasServiceInput) => {
  logger.info(`Mencoba membuat kelas: ${data.namaKelas}`);

  const tingkatan = await prisma.tingkatanKelas.findUnique({
    where: { id: data.tingkatanId },
  });
  if (!tingkatan) {
    throw new AppError("Tingkatan Kelas tidak ditemukan", 404);
  }

  if (data.waliKelasId) {
    const guru = await prisma.guru.findUnique({
      where: { id: data.waliKelasId },
    });
    if (!guru) {
      throw new AppError("Guru (calon Wali Kelas) tidak ditemukan", 404);
    }
  }

  const newKelas = await createKelasRepo(data);

  return newKelas;
};

export const updateKelasService = async (
  id: string,
  data: Partial<CreateKelasServiceInput>
) => {
  logger.info(`Mencoba update kelas: ${id}`);

  if (data.waliKelasId) {
    const guru = await prisma.guru.findUnique({
      where: { id: data.waliKelasId },
    });
    if (!guru) {
      throw new AppError("Guru (calon Wali Kelas) tidak ditemukan", 404);
    }
  }

  return await updateKelasRepo(id, data);
};

export const deleteKelasService = async (id: string) => {
  logger.info(`Mencoba hapus kelas: ${id}`);
  return await deleteKelasRepo(id);
};

export const getAllKelasService = async () => {
  logger.info("Fetching all kelas");
  return await findAllKelasRepo();
};

export const getMyClassService = async (guruId: string) => {
  logger.info(`Fetching class for wali kelas: ${guruId}`);
  const kelas = await getKelasByWaliKelasRepo(guruId);

  if (!kelas) {
    throw new AppError(
      "Anda tidak terdaftar sebagai Wali Kelas untuk kelas manapun.",
      404
    );
  }

  return kelas;
};

export const getMyTeachingClassesService = async (guruId: string) => {
  logger.info(`Fetching teaching classes for guru: ${guruId}`);
  return await getKelasByGuruIdRepo(guruId);
};
