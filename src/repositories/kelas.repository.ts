import { prisma } from "../config/prisma";

interface CreateKelasInput {
  namaKelas: string;
  tingkatanId: string;
  waliKelasId?: string;
}

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
    throw error;
  }
};

export const updateKelasRepo = async (
  id: string,
  data: Partial<CreateKelasInput>
) => {
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
      namaKelas: "asc",
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

export const getKelasByIdWithStudentsRepo = async (kelasId: string) => {
  return await prisma.kelas.findUnique({
    where: { id: kelasId },
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

export const getKelasByGuruIdRepo = async (guruId: string) => {
  const penugasan = await prisma.penugasanGuru.findMany({
    where: { guruId },
    include: {
      kelas: true,
    },
    distinct: ["kelasId"],
  });

  return penugasan.map((p) => p.kelas);
};
