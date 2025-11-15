import { prisma } from "../config/prisma";

interface CreateRuanganInput {
  namaRuangan: string;
  kapasitas?: number;
  adminId: string;
}

/**
 * Membuat data Ruangan baru
 */
export const createRuanganRepo = async (data: CreateRuanganInput) => {
  try {
    const newRuangan = await prisma.ruangan.create({
      data: {
        namaRuangan: data.namaRuangan,
        kapasitas: data.kapasitas,
        adminId: data.adminId,
      },
    });
    return newRuangan;
  } catch (error) {
    // Tangani error, misal namaRuangan duplikat
    throw error;
  }
};