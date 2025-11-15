import { UserRole } from "../generated/prisma";
import { createGuruRepo } from "../repositories/guru.repository";
import { hashPassword } from "../utils/hashPassword";
import logger from "../utils/logger";

// Tipe data input dari Controller
interface CreateGuruServiceInput {
  nip: string;
  nama: string;
  email?: string;
  username: string;
  passwordDefault: string; // Admin menyediakan password awal
}

export const createGuruService = async (data: CreateGuruServiceInput) => {
  const { nip, nama, email, username, passwordDefault } = data;

  // 1. Hash password default yang diinput Admin
  const passwordHash = await hashPassword(passwordDefault);
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