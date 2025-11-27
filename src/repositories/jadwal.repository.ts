import { prisma } from "../config/prisma";

interface CreateJadwalInput {
  tahunAjaranId: string;
  kelasId: string;
  mapelId: string;
  guruId: string;
  ruanganId: string;
  hari: string;
  waktuMulai: string;
  waktuSelesai: string;
}

export const createJadwalRepo = async (data: CreateJadwalInput) => {
  try {
    const newJadwal = await prisma.jadwal.create({
      data: {
        tahunAjaranId: data.tahunAjaranId,
        kelasId: data.kelasId,
        mapelId: data.mapelId,
        guruId: data.guruId,
        ruanganId: data.ruanganId,
        hari: data.hari,
        waktuMulai: data.waktuMulai,
        waktuSelesai: data.waktuSelesai,
      },
    });
    return newJadwal;
  } catch (error) {
    throw error;
  }
};
