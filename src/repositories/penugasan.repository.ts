import { prisma } from "../config/prisma";

interface CreatePenugasanInput {
  guruId: string;
  mapelId: string;
  kelasId: string;
}

export const createPenugasanRepo = async (data: CreatePenugasanInput) => {
  try {
    const newPenugasan = await prisma.penugasanGuru.create({
      data: {
        guruId: data.guruId,
        mapelId: data.mapelId,
        kelasId: data.kelasId,
      },
    });
    return newPenugasan;
  } catch (error) {
    throw error;
  }
};

export const findPenugasanUnik = async (
  guruId: string,
  mapelId: string,
  kelasId: string
) => {
  return prisma.penugasanGuru.findUnique({
    where: {
      guruId_mapelId_kelasId: {
        guruId: guruId,
        mapelId: mapelId,
        kelasId: kelasId,
      },
    },
  });
};
