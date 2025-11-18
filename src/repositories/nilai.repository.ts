import { prisma } from "../config/prisma";

export interface InputNilaiItem {
  siswaId: string;
  nilai: number;
}

/**
 * Menyimpan (Create/Update) nilai siswa untuk satu komponen tertentu
 */
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
          guruId: guruId, // Update siapa guru yang terakhir mengubah
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