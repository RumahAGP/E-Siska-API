import { prisma } from "../config/prisma";

interface CreatePenempatanInput {
  siswaId: string;
  kelasId: string;
  tahunAjaranId: string;
}

export const createPenempatanRepo = async (data: CreatePenempatanInput) => {
  try {
    const newPenempatan = await prisma.penempatanSiswa.create({
      data: {
        siswaId: data.siswaId,
        kelasId: data.kelasId,
        tahunAjaranId: data.tahunAjaranId,
      },
    });
    return newPenempatan;
  } catch (error) {
    throw error;
  }
};

export const findPenempatanBySiswaAndTahun = async (
  siswaId: string,
  tahunAjaranId: string
) => {
  return prisma.penempatanSiswa.findUnique({
    where: {
      siswaId_tahunAjaranId: {
        siswaId: siswaId,
        tahunAjaranId: tahunAjaranId,
      },
    },
  });
};
