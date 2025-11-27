import { prisma } from "../config/prisma";
import { AbsensiStatus } from "../generated/prisma";

export interface AbsensiInputItem {
  siswaId: string;
  status: AbsensiStatus;
}

export const upsertAbsensiDetailRepo = async (
  sesiId: string,
  dataSiswa: AbsensiInputItem[]
) => {
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
