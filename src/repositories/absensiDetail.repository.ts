import { prisma } from "../config/prisma";
import { AbsensiStatus } from "../generated/prisma";

export interface AbsensiInputItem {
  siswaId: string;
  status: AbsensiStatus;
}

/**
 * Menyimpan (Create/Update) detail absensi untuk satu sesi
 */
export const upsertAbsensiDetailRepo = async (
  sesiId: string,
  dataSiswa: AbsensiInputItem[]
) => {
  // Kita gunakan transaksi untuk memastikan semua tersimpan atau gagal sama sekali
  return prisma.$transaction(
    dataSiswa.map((item) =>
      prisma.absensiDetail.upsert({
        where: {
          siswaId_sesiId: {
            sesiId: sesiId,
            siswaId: item.siswaId,
          },
        },
        update: {
          status: item.status,
        },
        create: {
          sesiId: sesiId,
          siswaId: item.siswaId,
          status: item.status,
        },
      })
    )
  );
};