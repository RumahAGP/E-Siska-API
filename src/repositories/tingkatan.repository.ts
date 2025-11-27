import { prisma } from "../config/prisma";

export const createTingkatanRepo = async (namaTingkat: string) => {
  try {
    const newTingkatan = await prisma.tingkatanKelas.create({
      data: {
        namaTingkat: namaTingkat,
        adminId: "ce00f605-e1e5-4e9a-95b0-1514490a8af4",
      },
    });
    return newTingkatan;
  } catch (error) {
    throw error;
  }
};
