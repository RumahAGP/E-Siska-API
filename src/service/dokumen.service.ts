import { createDokumenRepo } from "../repositories/dokumen.repository";
import logger from "../utils/logger";
import { cloudinaryUpload } from "../config/cloudinary";
import AppError from "../utils/AppError";
import { prisma } from "../config/prisma";

interface CreateDokumenServiceInput {
  judul: string;
  file: Express.Multer.File; // File dari multer
  // adminUserId: string; // Akan kita dapatkan dari token nanti
}

export const createDokumenService = async (
  data: CreateDokumenServiceInput,
) => {
  logger.info(`Mencoba mengupload dokumen: ${data.judul}`);

  // 1. Upload file ke Cloudinary
  const uploadResult = await cloudinaryUpload(data.file);
  logger.info(`File berhasil diupload ke Cloudinary: ${uploadResult.secure_url}`);

  // TODO: adminUserId harus didapat dari data user (Admin) yang sedang login
  const ADMIN_USER_ID_DUMMY = (await prisma.admin.findFirst({
      where: { id: "dummy-admin-id-untuk-tes" },
      include: { user: true }
  }))?.user.id || "dummy-admin-user-id"; // fallback


  // 2. Siapkan data untuk repository
  const repoInput = {
    judul: data.judul,
    urlFile: uploadResult.secure_url,
    adminId: ADMIN_USER_ID_DUMMY,
  };

  // 3. Panggil Repository
  const newDokumen = await createDokumenRepo(repoInput);

  return newDokumen;
};