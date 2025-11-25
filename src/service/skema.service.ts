import { 
  addKomponenToSkemaRepo, 
  getSkemaByMapelIdRepo, 
  deleteKomponenRepo 
} from "../repositories/skema.repository";
import logger from "../utils/logger";
import { MapelCategory, NilaiKomponenType } from "../generated/prisma";
import AppError from "../utils/AppError";
import { prisma } from "../config/prisma"; // Kita butuh prisma di service untuk validasi

interface AddKomponenServiceInput {
  skemaId: string;
  namaKomponen: string;
  tipe: string; // Terima sebagai string dari validator
  formula?: string;
  urutan: number;
}

export const addKomponenToSkemaService = async (
  data: AddKomponenServiceInput,
) => {
  logger.info(`Mencoba menambah komponen ke skema: ${data.skemaId}`);
  const tipeKomponen = data.tipe as NilaiKomponenType;

  // --- Logika Bisnis 1: Validasi Tipe vs Formula ---
  // Sesuai dokumen, READ_ONLY harus punya formula
  if (
    tipeKomponen === NilaiKomponenType.READ_ONLY &&
    !data.formula
  ) {
    throw new AppError("Komponen Tipe READ_ONLY wajib memiliki formula", 400);
  }
  // Sesuai dokumen, INPUT tidak boleh punya formula
  if (tipeKomponen === NilaiKomponenType.INPUT && data.formula) {
    throw new AppError("Komponen Tipe INPUT tidak boleh memiliki formula", 400);
  }

  // --- Logika Bisnis 2: Validasi Kategori Mapel ---
  // Cek skema dan mapel terkait
  const skema = await prisma.skemaPenilaian.findUnique({
    where: { id: data.skemaId },
    include: { mapel: true }, // Ambil data mapel terkait
  });

  if (!skema) {
    throw new AppError("Skema Penilaian tidak ditemukan", 404);
  }

  // Sesuai dokumen, Eskul tidak pakai formula engine
  if (skema.mapel.kategori === MapelCategory.EKSTRAKURIKULER) {
    throw new AppError(
      "Tidak dapat menambah komponen nilai ke mapel Ekstrakurikuler",
      400,
    );
  }

  // --- Persiapan ke Repository ---
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
  
  // Cek apakah komponen ada (opsional, deleteRepo akan throw error jika tidak ada)
  // Tapi baiknya cek dulu untuk custom error message
  const komponen = await prisma.nilaiKomponen.findUnique({ where: { id: komponenId } });
  if (!komponen) {
    throw new AppError("Komponen tidak ditemukan", 404);
  }

  await deleteKomponenRepo(komponenId);
  return { message: "Komponen berhasil dihapus" };
};