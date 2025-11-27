import { prisma } from "../config/prisma";
import { MapelCategory } from "../generated/prisma";

interface CreateMapelInput {
  namaMapel: string;
  kategori: MapelCategory;
  adminId: string;
}

export const createMapelRepo = async (data: CreateMapelInput) => {
  const { namaMapel, kategori, adminId } = data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const newMapel = await tx.mataPelajaran.create({
        data: {
          namaMapel: namaMapel,
          kategori: kategori,
          adminId: adminId,
        },
      });

      const newSkema = await tx.skemaPenilaian.create({
        data: {
          mapelId: newMapel.id,
          adminId: adminId,
        },
      });

      return { mapel: newMapel, skema: newSkema };
    });

    return result;
  } catch (error) {
    throw error;
  }
};

export const updateMapelRepo = async (
  id: string,
  data: Partial<CreateMapelInput>
) => {
  return await prisma.mataPelajaran.update({
    where: { id },
    data,
  });
};

export const deleteMapelRepo = async (id: string) => {
  return await prisma.mataPelajaran.delete({
    where: { id },
  });
};

export const getAllMapelRepo = async () => {
  return await prisma.mataPelajaran.findMany({
    orderBy: { namaMapel: "asc" },
  });
};
