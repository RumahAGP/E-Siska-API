import {
  upsertCapaianRepo,
  InputCapaianItem,
} from "../repositories/capaian.repository";
import logger from "../utils/logger";
import AppError from "../utils/AppError";
import { prisma } from "../config/prisma";
import { MapelCategory } from "../generated/prisma";

interface InputCapaianServiceInput {
  guruId: string;
  mapelId: string;
  data: { siswaId: string; deskripsi: string }[];
}

export const inputCapaianService = async (input: InputCapaianServiceInput) => {
  logger.info(`Mencoba input capaian kompetensi untuk mapel ${input.mapelId}`);

  const mapel = await prisma.mataPelajaran.findUnique({
    where: { id: input.mapelId },
  });

  if (!mapel) {
    throw new AppError("Mata Pelajaran tidak ditemukan", 404);
  }

  if (mapel.kategori === MapelCategory.EKSTRAKURIKULER) {
    throw new AppError(
      "Ekstrakurikuler menggunakan menu input nilai tersendiri, bukan Capaian Kompetensi.",
      400
    );
  }

  const penugasan = await prisma.penugasanGuru.findFirst({
    where: {
      guruId: input.guruId,
      mapelId: input.mapelId,
    },
  });

  if (!penugasan) {
    throw new AppError(
      "Anda tidak terdaftar sebagai pengajar mata pelajaran ini.",
      403
    );
  }

  const result = await upsertCapaianRepo(
    input.guruId,
    input.mapelId,
    input.data
  );

  return result;
};
