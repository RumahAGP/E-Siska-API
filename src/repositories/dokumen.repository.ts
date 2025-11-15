import { prisma } from "../config/prisma";

interface CreateDokumenInput {
  judul: string;
  urlFile: string; // URL dari Cloudinary
  adminId: string; // Ini merujuk ke User ID Admin
}

/**
 * Membuat data Dokumen baru
 */
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