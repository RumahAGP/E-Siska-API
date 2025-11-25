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

export const getNilaiKelasRepo = async (kelasId: string, mapelId: string) => {
  // 1. Ambil semua siswa di kelas ini (via PenempatanSiswa)
  // Asumsi: Kita ambil tahun ajaran aktif (perlu logic tambahan di service untuk tentukan TA aktif)
  // Untuk simplifikasi repo, kita terima list siswaId atau kita join dengan PenempatanSiswa
  
  // Query: Ambil siswa yang ada di kelas ini
  const students = await prisma.penempatanSiswa.findMany({
    where: { kelasId },
    include: { siswa: true },
    orderBy: { siswa: { nama: 'asc' } }
  });

  // 2. Ambil nilai mereka untuk mapel ini
  const grades = await prisma.nilaiDetailSiswa.findMany({
    where: {
      mapelId,
      siswaId: { in: students.map(s => s.siswaId) }
    }
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
        select: { nama: true }
      }
    },
    orderBy: {
      mapel: { namaMapel: 'asc' }
    }
  });
};