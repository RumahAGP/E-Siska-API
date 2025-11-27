import {
  createMapelRepo,
  updateMapelRepo,
  deleteMapelRepo,
  getAllMapelRepo,
} from "../repositories/mapel.repository";
import logger from "../utils/logger";
import { MapelCategory } from "../generated/prisma";

interface CreateMapelServiceInput {
  namaMapel: string;
  kategori: string;
  adminId: string;
}

export const createMapelService = async (data: CreateMapelServiceInput) => {
  logger.info(`Mencoba membuat mata pelajaran: ${data.namaMapel}`);

  const repoInput = {
    namaMapel: data.namaMapel,
    kategori: data.kategori as MapelCategory,
    adminId: data.adminId,
  };

  const newData = await createMapelRepo(repoInput);

  return newData;
};

export const updateMapelService = async (
  id: string,
  data: Partial<CreateMapelServiceInput>
) => {
  logger.info(`Mencoba update mata pelajaran: ${id}`);

  const updateData: any = { ...data };
  if (data.kategori) {
    updateData.kategori = data.kategori as MapelCategory;
  }

  return await updateMapelRepo(id, updateData);
};

export const deleteMapelService = async (id: string) => {
  logger.info(`Mencoba hapus mata pelajaran: ${id}`);
  return await deleteMapelRepo(id);
};

export const getAllMapelService = async () => {
  logger.info(`Fetching all mata pelajaran`);
  return await getAllMapelRepo();
};
