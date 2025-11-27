import { UserRole } from "../generated/prisma";
import { prisma } from "../config/prisma";
import {
  createSiswaRepo,
  getAllSiswaRepo,
  getSiswaByIdRepo,
  updateSiswaRepo,
  deleteSiswaRepo,
} from "../repositories/siswa.repository";
import AppError from "../utils/AppError";
import { hashPassword } from "../utils/hashPassword";
import logger from "../utils/logger";

interface CreateSiswaServiceInput {
  nis: string;
  nisn?: string;
  nama: string;
  jenisKelamin?: string;
  agama?: string;
  tempatLahir?: string;
  tanggalLahir?: string; // Terima sebagai string, ubah ke Date
  pendidikanSebelumnya?: string;
  alamat?: string;
  namaAyah?: string;
  pekerjaanAyah?: string;
  namaIbu?: string;
  pekerjaanIbu?: string;
  alamatOrtu?: string;
  namaWali?: string;
  pekerjaanWali?: string;
  alamatWali?: string;
  status?: string;
  nik?: string;
}

export const createSiswaService = async (data: CreateSiswaServiceInput) => {
  const { nis, nama, tanggalLahir, alamat } = data;

  // Logika Bisnis: Sesuai dokumen
  // 1. Username adalah NIS
  const username = nis;
  // 2. Password default adalah 6 digit terakhir NIS
  if (nis.length < 6) {
    throw new AppError("NIS harus memiliki minimal 6 digit", 400);
  }
  const defaultPassword = nis.slice(-6);

  // 3. Hash password
  const passwordHash = await hashPassword(defaultPassword);
  logger.info(`Password default dibuat untuk NIS: ${nis}`);

  // 4. Siapkan data untuk repository
  const repoInput = {
    nis,
    nisn: data.nisn,
    nama,
    jenisKelamin: data.jenisKelamin,
    agama: data.agama,
    tempatLahir: data.tempatLahir,
    tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : undefined,
    pendidikanSebelumnya: data.pendidikanSebelumnya,
    alamat,
    namaAyah: data.namaAyah,
    pekerjaanAyah: data.pekerjaanAyah,
    namaIbu: data.namaIbu,
    pekerjaanIbu: data.pekerjaanIbu,
    alamatOrtu: data.alamatOrtu,
    namaWali: data.namaWali,
    pekerjaanWali: data.pekerjaanWali,
    alamatWali: data.alamatWali,
    status: data.status,
    nik: data.nik,
    username,
    passwordHash,
    role: UserRole.SISWA, // Role dari enum
  };

  // 5. Panggil Repository
  const newSiswaData = await createSiswaRepo(repoInput);

  return newSiswaData;
};

/**
 * Get all Students with pagination
 */
export const getAllSiswaService = async (
  page: number = 1,
  limit: number = 50
) => {
  const skip = (page - 1) * limit;
  const take = limit;

  logger.info(`Fetching all siswa - Page: ${page}, Limit: ${limit}`);

  const students = await getAllSiswaRepo(skip, take);
  const total = await prisma.siswa.count();

  return {
    data: students,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get Student by ID
 */
export const getSiswaByIdService = async (id: string) => {
  logger.info(`Fetching siswa by ID: ${id}`);

  const siswa = await getSiswaByIdRepo(id);

  if (!siswa) {
    throw new AppError("Siswa tidak ditemukan", 404);
  }

  return siswa;
};

interface UpdateSiswaServiceInput {
  nis?: string;
  nisn?: string;
  nama?: string;
  jenisKelamin?: string;
  agama?: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  pendidikanSebelumnya?: string;
  alamat?: string;
  namaAyah?: string;
  pekerjaanAyah?: string;
  namaIbu?: string;
  pekerjaanIbu?: string;
  alamatOrtu?: string;
  namaWali?: string;
  pekerjaanWali?: string;
  alamatWali?: string;
  status?: string;
  nik?: string;
}

/**
 * Update Student data
 */
export const updateSiswaService = async (
  id: string,
  data: UpdateSiswaServiceInput
) => {
  logger.info(`Updating siswa: ${id}`);

  // Check if siswa exists
  const existingSiswa = await getSiswaByIdRepo(id);
  if (!existingSiswa) {
    throw new AppError("Siswa tidak ditemukan", 404);
  }

  // Prepare update data
  const updateData: any = {};
  if (data.nis) updateData.nis = data.nis;
  if (data.nisn) updateData.nisn = data.nisn;
  if (data.nama) updateData.nama = data.nama;
  if (data.jenisKelamin) updateData.jenisKelamin = data.jenisKelamin;
  if (data.agama) updateData.agama = data.agama;
  if (data.tempatLahir) updateData.tempatLahir = data.tempatLahir;
  if (data.tanggalLahir) updateData.tanggalLahir = new Date(data.tanggalLahir);
  if (data.pendidikanSebelumnya)
    updateData.pendidikanSebelumnya = data.pendidikanSebelumnya;
  if (data.alamat !== undefined) updateData.alamat = data.alamat;
  if (data.namaAyah) updateData.namaAyah = data.namaAyah;
  if (data.pekerjaanAyah) updateData.pekerjaanAyah = data.pekerjaanAyah;
  if (data.namaIbu) updateData.namaIbu = data.namaIbu;
  if (data.pekerjaanIbu) updateData.pekerjaanIbu = data.pekerjaanIbu;
  if (data.alamatOrtu) updateData.alamatOrtu = data.alamatOrtu;
  if (data.namaWali) updateData.namaWali = data.namaWali;
  if (data.pekerjaanWali) updateData.pekerjaanWali = data.pekerjaanWali;
  if (data.alamatWali) updateData.alamatWali = data.alamatWali;
  if (data.status) updateData.status = data.status;
  if (data.nik) updateData.nik = data.nik;

  const updatedSiswa = await updateSiswaRepo(id, updateData);

  return updatedSiswa;
};

/**
 * Delete Student
 */
export const deleteSiswaService = async (id: string) => {
  logger.info(`Deleting siswa: ${id}`);

  // Check if siswa exists
  const existingSiswa = await getSiswaByIdRepo(id);
  if (!existingSiswa) {
    throw new AppError("Siswa tidak ditemukan", 404);
  }

  // Delete siswa (cascade will delete user)
  await deleteSiswaRepo(id);

  return { message: "Siswa berhasil dihapus" };
};
