import { upsertAbsensiDetailRepo, AbsensiInputItem } from "../repositories/absensiDetail.repository";
import logger from "../utils/logger";
import AppError from "../utils/AppError";
import { prisma } from "../config/prisma";
import { AbsensiStatus } from "../generated/prisma";

interface InputAbsensiServiceInput {
  sesiId: string;
  data: { siswaId: string; status: string }[];
}

export const inputAbsensiService = async (input: InputAbsensiServiceInput) => {
  logger.info(`Mencoba input detail absensi untuk sesi ${input.sesiId}`);

  // 1. Cek apakah sesi absensi ada
  const sesi = await prisma.absensiSesi.findUnique({
    where: { id: input.sesiId },
  });

  if (!sesi) {
    throw new AppError("Sesi absensi tidak ditemukan", 404);
  }

  // 2. Validasi format status dan konversi ke Enum
  const formattedData: AbsensiInputItem[] = input.data.map((item) => {
    if (!Object.values(AbsensiStatus).includes(item.status as AbsensiStatus)) {
      throw new AppError(`Status absensi tidak valid untuk siswa ${item.siswaId}`, 400);
    }
    return {
      siswaId: item.siswaId,
      status: item.status as AbsensiStatus,
    };
  });

  // 3. Simpan ke database
  const result = await upsertAbsensiDetailRepo(input.sesiId, formattedData);

  return result;
};