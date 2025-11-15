import { prisma } from "../config/prisma";
import { MapelCategory } from "../generated/prisma";

interface CreateMapelInput {
  namaMapel: string;
  kategori: MapelCategory;
  adminId: string;
}

/**
 * Membuat data Mata Pelajaran baru beserta Skema Penilaian (kosong)
 * dalam satu transaksi.
 */
export const createMapelRepo = async (data: CreateMapelInput) => {
  const { namaMapel, kategori, adminId } = data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Buat Mata Pelajaran
      const newMapel = await tx.mataPelajaran.create({
        data: {
          namaMapel: namaMapel,
          kategori: kategori,
          adminId: adminId,
        },
      });

      // 2. Buat Skema Penilaian yang terhubung
      const newSkema = await tx.skemaPenilaian.create({
        data: {
          mapelId: newMapel.id,
          adminId: adminId,
        },
      });

      return { mapel: newMapel, skema: newSkema };
    });

    return result;
  } catch (error) {
    // Tangani error, misal namaMapel duplikat
    throw error;
  }
};