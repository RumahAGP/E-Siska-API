import { prisma } from "../config/prisma";

export interface InputNilaiItem {
  siswaId: string;
  nilai: number;
}

export const upsertNilaiRepo = async (
  guruId: string,
  mapelId: string,
  komponenId: string,
  dataNilai: InputNilaiItem[]
) => {
  return prisma.$transaction(
    dataNilai.map((item) =>
      prisma.nilaiDetailSiswa.upsert({
        where: {
          siswaId_mapelId_komponenId: {
            siswaId: item.siswaId,
            mapelId: mapelId,
            komponenId: komponenId,
          },
        },
        update: {
          nilaiAngka: item.nilai,
          guruId: guruId,
        },
        create: {
          siswaId: item.siswaId,
          mapelId: mapelId,
          komponenId: komponenId,
          guruId: guruId,
          nilaiAngka: item.nilai,
        },
      })
    )
  );
};

export const getNilaiKelasRepo = async (kelasId: string, mapelId: string) => {
  const students = await prisma.penempatanSiswa.findMany({
    where: { kelasId },
    include: { siswa: true },
    orderBy: { siswa: { nama: "asc" } },
  });

  const grades = await prisma.nilaiDetailSiswa.findMany({
    where: {
      mapelId,
      siswaId: { in: students.map((s) => s.siswaId) },
    },
  });

  return { students, grades };
};

export const getNilaiBySiswaIdRepo = async (siswaId: string) => {
  return await prisma.nilaiDetailSiswa.findMany({
    where: { siswaId },
    include: {
      mapel: true,
      komponen: true,
      guru: {
        select: { nama: true },
      },
    },
    orderBy: {
      mapel: { namaMapel: "asc" },
    },
  });
};

export const getAllNilaiRepo = async (filters?: {
  siswaId?: string;
  mapelId?: string;
  tahunAjaranId?: string;
}) => {
  return await prisma.nilaiDetailSiswa.findMany({
    where: {
      ...(filters?.siswaId && { siswaId: filters.siswaId }),
      ...(filters?.mapelId && { mapelId: filters.mapelId }),
    },
    include: {
      siswa: {
        select: {
          id: true,
          nama: true,
          nis: true,
        },
      },
      mapel: {
        select: {
          id: true,
          namaMapel: true,
        },
      },
      komponen: {
        select: {
          id: true,
          namaKomponen: true,
        },
      },
      guru: {
        select: {
          id: true,
          nama: true,
        },
      },
    },
    orderBy: [{ siswa: { nama: "asc" } }, { mapel: { namaMapel: "asc" } }],
  });
};

export const updateNilaiRepo = async (
  id: string,
  nilai: number,
  guruId: string
) => {
  return await prisma.nilaiDetailSiswa.update({
    where: { id },
    data: {
      nilaiAngka: nilai,
      guruId: guruId,
    },
    include: {
      siswa: true,
      mapel: true,
      komponen: true,
    },
  });
};

export const deleteNilaiRepo = async (id: string) => {
  return await prisma.nilaiDetailSiswa.delete({
    where: { id },
  });
};
