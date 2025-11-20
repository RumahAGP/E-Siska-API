import { prisma } from "../config/prisma";

/**
 * Membuat data Tingkatan Kelas baru (Versi Sederhana Tanpa AdminId)
 */
export const createTingkatanRepo = async (namaTingkat: string) => {
  try {
    const newTingkatan = await prisma.tingkatanKelas.create({
      data: {
        namaTingkat: namaTingkat,
        // adminId akan ditambahkan nanti saat auth sudah siap
        // Untuk sementara, skema HARUS diubah agar adminId opsional (?)
        // atau kita pakai adminId dummy
        adminId: "ce00f605-e1e5-4e9a-95b0-1514490a8af4", // Pastikan ID ini ADA di db
      },
    });
    return newTingkatan;
  } catch (error) {
    throw error;
  }
};