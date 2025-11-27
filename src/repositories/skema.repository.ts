import { prisma } from "../config/prisma";
import { NilaiKomponenType } from "../generated/prisma";

interface AddKomponenInput {
  skemaId: string;
  namaKomponen: string;
  tipe: NilaiKomponenType;
  formula?: string;
  urutan: number;
}

export const addKomponenToSkemaRepo = async (data: AddKomponenInput) => {
  return await prisma.nilaiKomponen.create({
    data: {
      skemaId: data.skemaId,
      namaKomponen: data.namaKomponen,
      tipe: data.tipe,
      formula: data.formula,
      urutan: data.urutan,
    },
  });
};

export const getSkemaByMapelIdRepo = async (mapelId: string) => {
  return await prisma.skemaPenilaian.findUnique({
    where: { mapelId },
    include: {
      Komponen: {
        orderBy: { urutan: "asc" },
      },
      mapel: true,
    },
  });
};

export const deleteKomponenRepo = async (komponenId: string) => {
  return await prisma.nilaiKomponen.delete({
    where: { id: komponenId },
  });
};
