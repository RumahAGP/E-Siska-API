import { prisma } from "../config/prisma";
import { NilaiKomponenType } from "../generated/prisma";

interface AddKomponenInput {
  skemaId: string;
  namaKomponen: string;
  tipe: NilaiKomponenType;
  formula?: string;
  urutan: number;
}

/**
 * Menambahkan NilaiKomponen baru ke SkemaPenilaian
 */
export const addKomponenToSkemaRepo = async (data: AddKomponenInput) => {
  try {
    const newKomponen = await prisma.nilaiKomponen.create({
      data: {
        skemaId: data.skemaId,
        namaKomponen: data.namaKomponen,
        tipe: data.tipe,
        formula: data.formula,
        urutan: data.urutan,
      },
    });
    return newKomponen;
  } catch (error) {
    // Tangani error, misal skemaId tidak ada
    throw error;
  }
};