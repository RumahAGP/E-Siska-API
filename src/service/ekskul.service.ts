import {
  saveNilaiEkskulRepo,
  InputEkskulItem,
} from "../repositories/ekskul.repository";
import logger from "../utils/logger";
import AppError from "../utils/AppError";
import { prisma } from "../config/prisma";
import { MapelCategory } from "../generated/prisma";

interface InputEkskulServiceInput {
  guruId: string;
  mapelId: string;
  data: { siswaId: string; deskripsi: string }[];
}

export const inputNilaiEkskulService = async (
  input: InputEkskulServiceInput
) => {
  logger.info(`Mencoba input nilai ekskul untuk mapel ${input.mapelId}`);

  const mapel = await prisma.mataPelajaran.findUnique({
    where: { id: input.mapelId },
  });

  if (!mapel) {
    throw new AppError("Mata Pelajaran tidak ditemukan", 404);
  }

  if (mapel.kategori !== MapelCategory.EKSTRAKURIKULER) {
    throw new AppError(
      `Fitur ini khusus untuk kategori EKSTRAKURIKULER. Mapel ini adalah ${mapel.kategori}.`,
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
      "Anda tidak terdaftar sebagai pembina ekstrakurikuler ini.",
      403
    );
  }

  const result = await saveNilaiEkskulRepo(
    input.guruId,
    input.mapelId,
    input.data
  );

  return result;
};
