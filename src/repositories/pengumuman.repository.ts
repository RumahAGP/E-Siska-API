import { prisma } from "../config/prisma";

interface CreatePengumumanInput {
  judul: string;
  konten: string;
  adminId: string;
}

export const createPengumumanRepo = async (data: CreatePengumumanInput) => {
  try {
    const newPengumuman = await prisma.pengumuman.create({
      data: {
        judul: data.judul,
        konten: data.konten,
        adminId: data.adminId,
      },
    });
    return newPengumuman;
  } catch (error) {
    throw error;
  }
};
