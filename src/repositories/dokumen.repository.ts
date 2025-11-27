import { prisma } from "../config/prisma";

interface CreateDokumenInput {
  judul: string;
  urlFile: string;
  adminId: string;
}

export const createDokumenRepo = async (data: CreateDokumenInput) => {
  try {
    const newDokumen = await prisma.dokumen.create({
      data: {
        judul: data.judul,
        urlFile: data.urlFile,
        adminId: data.adminId,
      },
    });
    return newDokumen;
  } catch (error) {
    throw error;
  }
};
