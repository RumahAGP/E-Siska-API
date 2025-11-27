import { prisma } from "../config/prisma";

interface CreateTahunAjaranInput {
  nama: string;
  adminId: string;
}

export const createTahunAjaranRepo = async (data: CreateTahunAjaranInput) => {
  try {
    const newTahunAjaran = await prisma.tahunAjaran.create({
      data: {
        nama: data.nama,
        adminId: data.adminId,
      },
    });
    return newTahunAjaran;
  } catch (error) {
    throw error;
  }
};
