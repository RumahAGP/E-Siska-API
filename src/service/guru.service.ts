import { UserRole } from "../generated/prisma";
import { prisma } from "../config/prisma";
import {
  createGuruRepo,
  getAllGuruRepo,
  getGuruByIdRepo,
  updateGuruRepo,
  deleteGuruRepo,
} from "../repositories/guru.repository";
import { hashPassword } from "../utils/hashPassword";
import logger from "../utils/logger";
import AppError from "../utils/AppError";

interface CreateGuruServiceInput {
  nip: string;
  nama: string;
  email?: string;
  username: string;
  passwordDefault?: string;
  jenisKelamin?: string;
  agama?: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  noTelp?: string;
  nik?: string;
  nuptk?: string;
  statusKepegawaian?: string;
  alamat?: string;
  isAktif?: boolean;
}

export const createGuruService = async (data: CreateGuruServiceInput) => {
  const { nip, nama, email, username } = data;

  let passwordToHash = data.passwordDefault;
  if (!passwordToHash && nip) {
    passwordToHash = nip.slice(-6);
    logger.info(
      `Auto-generated password for guru from NIP: ${nip} -> last 6 digits`
    );
  }

  if (!passwordToHash) {
    throw new AppError("Password atau NIP harus disediakan", 400);
  }

  const passwordHash = await hashPassword(passwordToHash);
  logger.info(`Password di-hash untuk user guru baru: ${username}`);

  const repoInput = {
    nip,
    nama,
    email,
    username,
    passwordHash,
    role: UserRole.GURU,
    jenisKelamin: data.jenisKelamin,
    agama: data.agama,
    tempatLahir: data.tempatLahir,
    tanggalLahir: data.tanggalLahir ? new Date(data.tanggalLahir) : undefined,
    noTelp: data.noTelp,
    nik: data.nik,
    nuptk: data.nuptk,
    statusKepegawaian: data.statusKepegawaian,
    alamat: data.alamat,
    isAktif: data.isAktif,
  };

  const newGuruData = await createGuruRepo(repoInput);

  return newGuruData;
};

export const getAllGuruService = async (
  page: number = 1,
  limit: number = 50
) => {
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
  jenisKelamin?: string;
  agama?: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  noTelp?: string;
  nik?: string;
  nuptk?: string;
  statusKepegawaian?: string;
  alamat?: string;
  isAktif?: boolean;
}

export const updateGuruService = async (
  id: string,
  data: UpdateGuruServiceInput
) => {
  logger.info(`Updating guru: ${id}`);

  const existingGuru = await getGuruByIdRepo(id);
  if (!existingGuru) {
    throw new AppError("Guru tidak ditemukan", 404);
  }

  const updateData: any = {};
  if (data.nip) updateData.nip = data.nip;
  if (data.nama) updateData.nama = data.nama;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.jenisKelamin) updateData.jenisKelamin = data.jenisKelamin;
  if (data.agama) updateData.agama = data.agama;
  if (data.tempatLahir) updateData.tempatLahir = data.tempatLahir;
  if (data.tanggalLahir) updateData.tanggalLahir = new Date(data.tanggalLahir);
  if (data.noTelp) updateData.noTelp = data.noTelp;
  if (data.nik) updateData.nik = data.nik;
  if (data.nuptk) updateData.nuptk = data.nuptk;
  if (data.statusKepegawaian)
    updateData.statusKepegawaian = data.statusKepegawaian;
  if (data.alamat) updateData.alamat = data.alamat;
  if (data.isAktif !== undefined) updateData.isAktif = data.isAktif;

  const updatedGuru = await updateGuruRepo(id, updateData);

  return updatedGuru;
};

export const deleteGuruService = async (id: string) => {
  logger.info(`Deleting guru: ${id}`);

  const existingGuru = await getGuruByIdRepo(id);
  if (!existingGuru) {
    throw new AppError("Guru tidak ditemukan", 404);
  }

  if (existingGuru.KelasBimbingan) {
    throw new AppError(
      "Guru masih menjadi wali kelas. Hapus penugasan wali kelas terlebih dahulu.",
      400
    );
  }

  await deleteGuruRepo(id);

  return { message: "Guru berhasil dihapus" };
};
