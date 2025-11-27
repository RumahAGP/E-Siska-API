import { prisma } from "../config/prisma";

export interface InputEkskulItem {
  siswaId: string;
  deskripsi: string;
}

export const saveNilaiEkskulRepo = async (
  guruId: string,
  mapelId: string,
  dataNilai: InputEkskulItem[]
) => {
  return prisma.$transaction(async (tx) => {
    const results = [];
    for (const item of dataNilai) {
      const existing = await tx.nilaiDetailSiswa.findFirst({
        where: {
          siswaId: item.siswaId,
          mapelId: mapelId,
          komponenId: null,
        },
      });

      if (existing) {
        const updated = await tx.nilaiDetailSiswa.update({
          where: { id: existing.id },
          data: {
            nilaiDeskripsi: item.deskripsi,
            guruId: guruId,
          },
        });
        results.push(updated);
      } else {
        const created = await tx.nilaiDetailSiswa.create({
          data: {
            siswaId: item.siswaId,
            mapelId: mapelId,
            komponenId: null,
            guruId: guruId,
            nilaiDeskripsi: item.deskripsi,
          },
        });
        results.push(created);
      }
    }
    return results;
  });
};
