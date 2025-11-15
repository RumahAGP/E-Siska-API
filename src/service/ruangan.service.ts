import { createRuanganRepo } from "../repositories/ruangan.repository";
import logger from "../utils/logger";

interface CreateRuanganServiceInput {
  namaRuangan: string;
  kapasitas?: number;
  // adminId: string; // Akan kita dapatkan dari token nanti
}

export const createRuanganService = async (
  data: CreateRuanganServiceInput,
) => {
  logger.info(`Mencoba membuat ruangan: ${data.namaRuangan}`);

  // TODO: adminId harus didapat dari data user yang sedang login (via token)
  // Kita gunakan ID dummy yang sama dari tes tingkatan
  const ADMIN_ID_DUMMY = "dummy-admin-id-untuk-tes";

  const repoInput = {
    ...data,
    adminId: ADMIN_ID_DUMMY,
  };

  // Panggil Repository
  const newRuangan = await createRuanganRepo(repoInput);

  return newRuangan;
};