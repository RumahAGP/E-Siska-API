import {
  addKomponenToSkemaRepo,
  getSkemaByMapelIdRepo,
  deleteKomponenRepo,
} from "../repositories/skema.repository";
import logger from "../utils/logger";
import { MapelCategory, NilaiKomponenType } from "../generated/prisma";
import AppError from "../utils/AppError";
import { prisma } from "../config/prisma";

interface AddKomponenServiceInput {
  skemaId: string;
  namaKomponen: string;
  tipe: string;
  formula?: string;
  urutan: number;
}

export const addKomponenToSkemaService = async (
  data: AddKomponenServiceInput
) => {
  logger.info(`Mencoba menambah komponen ke skema: ${data.skemaId}`);
  const tipeKomponen = data.tipe as NilaiKomponenType;

  if (tipeKomponen === NilaiKomponenType.READ_ONLY && !data.formula) {
    throw new AppError("Komponen Tipe READ_ONLY wajib memiliki formula", 400);
  }
  if (tipeKomponen === NilaiKomponenType.INPUT && data.formula) {
    throw new AppError("Komponen Tipe INPUT tidak boleh memiliki formula", 400);
  }

  const skema = await prisma.skemaPenilaian.findUnique({
    where: { id: data.skemaId },
    include: { mapel: true },
  });

  if (!skema) {
    throw new AppError("Skema Penilaian tidak ditemukan", 404);
  }

  if (skema.mapel.kategori === MapelCategory.EKSTRAKURIKULER) {
    throw new AppError(
      "Tidak dapat menambah komponen nilai ke mapel Ekstrakurikuler",
      400
    );
  }

  const repoInput = {
    skemaId: data.skemaId,
    namaKomponen: data.namaKomponen,
    tipe: tipeKomponen,
    formula: data.formula,
    urutan: data.urutan,
  };

  const newKomponen = await addKomponenToSkemaRepo(repoInput);

  return newKomponen;
};

export const getSkemaByMapelIdService = async (mapelId: string) => {
  logger.info(`Fetching skema penilaian untuk mapel: ${mapelId}`);

  const skema = await getSkemaByMapelIdRepo(mapelId);

  if (!skema) {
    throw new AppError("Skema penilaian belum dibuat untuk mapel ini", 404);
  }

  return skema;
};

export const deleteKomponenService = async (komponenId: string) => {
  logger.info(`Menghapus komponen nilai: ${komponenId}`);

  const komponen = await prisma.nilaiKomponen.findUnique({
    where: { id: komponenId },
  });
  if (!komponen) {
    throw new AppError("Komponen tidak ditemukan", 404);
  }

  await deleteKomponenRepo(komponenId);
  return { message: "Komponen berhasil dihapus" };
};
