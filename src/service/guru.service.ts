import { UserRole } from "../generated/prisma";
import { prisma } from "../config/prisma";
import { 
  createGuruRepo,
  getAllGuruRepo,
  getGuruByIdRepo,
  updateGuruRepo,
  deleteGuruRepo
} from "../repositories/guru.repository";
import { hashPassword } from "../utils/hashPassword";
import logger from "../utils/logger";
import AppError from "../utils/AppError";

// Tipe data input dari Controller
interface CreateGuruServiceInput {
  nip: string;
  nama: string;
  email?: string;
  username: string;
  passwordDefault?: string; // Admin dapat menyediakan password awal (optional)
}

export const createGuruService = async (data: CreateGuruServiceInput) => {
  const { nip, nama, email, username } = data;
  
  // Auto-generate password from last 6 digits of NIP if not provided
  let passwordToHash = data.passwordDefault;
  if (!passwordToHash && nip) {
    passwordToHash = nip.slice(-6); // Get last 6 digits
    logger.info(`Auto-generated password for guru from NIP: ${nip} -> last 6 digits`);
  }

  if (!passwordToHash) {
    throw new AppError("Password atau NIP harus disediakan", 400);
  }

  // 1. Hash password default yang diinput Admin or auto-generated
  const passwordHash = await hashPassword(passwordToHash);
  logger.info(`Password di-hash untuk user guru baru: ${username}`);

  // 2. Siapkan data untuk repository
  const repoInput = {
    nip,
    nama,
    email,
    username,
    passwordHash,
    role: UserRole.GURU, // Set role sebagai GURU
  };

  // 3. Panggil Repository
  const newGuruData = await createGuruRepo(repoInput);

  return newGuruData;
};

/**
 * Get all Guru with pagination
 */
export const getAllGuruService = async (page: number = 1, limit: number = 50) => {
  const skip = (page - 1) * limit;
  const take = limit;

  logger.info(`Fetching all guru - Page: ${page}, Limit: ${limit}`);

  const teachers = await getAllGuruRepo(skip, take);
  const total = await prisma.guru.count();

  return {
    data: teachers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get Guru by ID
 */
export const getGuruByIdService = async (id: string) => {
  logger.info(`Fetching guru by ID: ${id}`);

  const guru = await getGuruByIdRepo(id);

  if (!guru) {
    throw new AppError("Guru tidak ditemukan", 404);
  }

  return guru;
};

interface UpdateGuruServiceInput {
  nip?: string;
  nama?: string;
  email?: string;
}

/**
 * Update Guru data
 */
export const updateGuruService = async (id: string, data: UpdateGuruServiceInput) => {
  logger.info(`Updating guru: ${id}`);

  // Check if guru exists
  const existingGuru = await getGuruByIdRepo(id);
  if (!existingGuru) {
    throw new AppError("Guru tidak ditemukan", 404);
  }

  // Prepare update data
  const updateData: any = {};
  if (data.nip) updateData.nip = data.nip;
  if (data.nama) updateData.nama = data.nama;
  if (data.email !== undefined) updateData.email = data.email;

  const updatedGuru = await updateGuruRepo(id, updateData);

  return updatedGuru;
};

/**
 * Delete Guru
 */
export const deleteGuruService = async (id: string) => {
  logger.info(`Deleting guru: ${id}`);

  // Check if guru exists
  const existingGuru = await getGuruByIdRepo(id);
  if (!existingGuru) {
    throw new AppError("Guru tidak ditemukan", 404);
  }

  // Check if guru is wali kelas
  if (existingGuru.KelasBimbingan) {
    throw new AppError("Guru masih menjadi wali kelas. Hapus penugasan wali kelas terlebih dahulu.", 400);
  }

  // Delete guru (cascade will delete user)
  await deleteGuruRepo(id);

  return { message: "Guru berhasil dihapus" };
};