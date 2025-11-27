import {
  createRuanganRepo,
  updateRuanganRepo,
  deleteRuanganRepo,
  getAllRuanganRepo,
} from "../repositories/ruangan.repository";
import logger from "../utils/logger";

interface CreateRuanganServiceInput {
  namaRuangan: string;
  kapasitas?: number;
  adminId: string;
}

export const createRuanganService = async (data: CreateRuanganServiceInput) => {
  logger.info(`Mencoba membuat ruangan: ${data.namaRuangan}`);

  const repoInput = {
    ...data,
  };

  const newRuangan = await createRuanganRepo(repoInput);

  return newRuangan;
};

export const updateRuanganService = async (
  id: string,
  data: Partial<CreateRuanganServiceInput>
) => {
  logger.info(`Mencoba update ruangan: ${id}`);

  const updateData: any = { ...data };

  return await updateRuanganRepo(id, updateData);
};

export const deleteRuanganService = async (id: string) => {
  logger.info(`Mencoba hapus ruangan: ${id}`);
  return await deleteRuanganRepo(id);
};

export const getAllRuanganService = async () => {
  logger.info(`Mencoba mengambil semua data ruangan`);
  return await getAllRuanganRepo();
};
