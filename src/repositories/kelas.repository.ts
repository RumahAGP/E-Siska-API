import { prisma } from "../config/prisma";

interface CreateKelasInput {
  namaKelas: string;
  tingkatanId: string;
  waliKelasId?: string; // Wali kelas bersifat opsional
}

/**
 * Membuat data Kelas baru
 */
export const createKelasRepo = async (data: CreateKelasInput) => {
  try {
    const newKelas = await prisma.kelas.create({
      data: {
        namaKelas: data.namaKelas,
        tingkatanId: data.tingkatanId,
        waliKelasId: data.waliKelasId,
      },
    });
    return newKelas;
  } catch (error) {
    // Tangani error, misal tingkatanId tidak ada atau waliKelasId unik terlanggar
    throw error;
  }
};

export const updateKelasRepo = async (id: string, data: Partial<CreateKelasInput>) => {
  return await prisma.kelas.update({
    where: { id },
    data,
  });
};

export const deleteKelasRepo = async (id: string) => {
  return await prisma.kelas.delete({
    where: { id },
  });
};

export const findAllKelasRepo = async () => {
  return await prisma.kelas.findMany({
    include: {
      tingkatan: true,
      waliKelas: true,
      _count: {
        select: { Penempatan: true },
      },
    },
    orderBy: {
      namaKelas: 'asc',
    },
  });
};

export const getKelasByWaliKelasRepo = async (waliKelasId: string) => {
  return await prisma.kelas.findFirst({
    where: { waliKelasId },
    include: {
      tingkatan: true,
      Penempatan: {
        include: {
          siswa: true,
        },
      },
    },
  });
};