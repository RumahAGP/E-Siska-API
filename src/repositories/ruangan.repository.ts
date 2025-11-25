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

export const updateRuanganRepo = async (id: string, data: Partial<CreateRuanganInput>) => {
  return await prisma.ruangan.update({
    where: { id },
    data,
  });
};

export const deleteRuanganRepo = async (id: string) => {
  return await prisma.ruangan.delete({
    where: { id },
  });
};

export const getAllRuanganRepo = async () => {
  return await prisma.ruangan.findMany({
    orderBy: {
      namaRuangan: 'asc',
    },
  });
};