import { prisma } from "../config/prisma";
import AppError from "../utils/AppError";
import logger from "../utils/logger";

export const getRekapNilaiKelasService = async (
  guruId: string,
  kelasId: string
) => {
  logger.info(`Guru ${guruId} fetching rekap nilai for kelas ${kelasId}`);

  const kelas = await prisma.kelas.findUnique({
    where: { id: kelasId },
    include: {
      tingkatan: true,
    },
  });

  if (!kelas) {
    throw new AppError("Kelas tidak ditemukan", 404);
  }

  if (kelas.waliKelasId !== guruId) {
    throw new AppError("Anda bukan wali kelas dari kelas ini", 403);
  }

  const siswaList = await prisma.penempatanSiswa.findMany({
    where: {
      kelasId: kelasId,
    },
    include: {
      siswa: true,
      tahunAjaran: true,
    },
  });

  const rekapNilai = await Promise.all(
    siswaList.map(async (penempatan: any) => {
      const rapor = await prisma.rapor.findFirst({
        where: {
          siswaId: penempatan.siswaId,
          tahunAjaranId: penempatan.tahunAjaranId,
        },
        include: {
          NilaiRaporAkhir: {
            include: {
              mapel: true,
            },
          },
        },
      });

      return {
        siswa: penempatan.siswa,
        rapor: rapor,
        nilaiAkhir: rapor?.NilaiRaporAkhir || [],
      };
    })
  );

  return {
    kelas: kelas,
    siswaList: rekapNilai,
  };
};

export const getRekapAbsensiKelasService = async (
  guruId: string,
  kelasId: string
) => {
  logger.info(`Guru ${guruId} fetching rekap absensi for kelas ${kelasId}`);

  const kelas = await prisma.kelas.findUnique({
    where: { id: kelasId },
    include: {
      tingkatan: true,
    },
  });

  if (!kelas) {
    throw new AppError("Kelas tidak ditemukan", 404);
  }

  if (kelas.waliKelasId !== guruId) {
    throw new AppError("Anda bukan wali kelas dari kelas ini", 403);
  }

  const siswaList = await prisma.penempatanSiswa.findMany({
    where: {
      kelasId: kelasId,
    },
    include: {
      siswa: true,
    },
  });

  const rekapAbsensi = await Promise.all(
    siswaList.map(async (penempatan: any) => {
      const absensiDetails = await prisma.absensiDetail.findMany({
        where: {
          siswaId: penempatan.siswaId,
          sesi: {
            kelasId: kelasId,
          },
        },
      });

      const summary = {
        hadir: absensiDetails.filter((a) => a.status === "HADIR").length,
        sakit: absensiDetails.filter((a) => a.status === "SAKIT").length,
        izin: absensiDetails.filter((a) => a.status === "IZIN").length,
        alpha: absensiDetails.filter((a) => a.status === "ALPHA").length,
        total: absensiDetails.length,
      };

      return {
        siswa: penempatan.siswa,
        summary: summary,
      };
    })
  );

  return {
    kelas: kelas,
    rekapAbsensi: rekapAbsensi,
  };
};

export const getDataSiswaBimbinganService = async (
  guruId: string,
  kelasId: string
) => {
  logger.info(`Guru ${guruId} fetching data siswa for kelas ${kelasId}`);

  const kelas = await prisma.kelas.findUnique({
    where: { id: kelasId },
    include: {
      tingkatan: true,
    },
  });

  if (!kelas) {
    throw new AppError("Kelas tidak ditemukan", 404);
  }

  if (kelas.waliKelasId !== guruId) {
    throw new AppError("Anda bukan wali kelas dari kelas ini", 403);
  }

  const siswaList = await prisma.penempatanSiswa.findMany({
    where: {
      kelasId: kelasId,
    },
    include: {
      siswa: {
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
      },
      tahunAjaran: true,
    },
    orderBy: {
      siswa: {
        nama: "asc",
      },
    },
  });

  return {
    kelas: kelas,
    totalSiswa: siswaList.length,
    siswaList: siswaList.map((p: any) => ({
      ...p.siswa,
      tahunAjaran: p.tahunAjaran,
    })),
  };
};

export const getMyKelasService = async (guruId: string) => {
  logger.info(`Guru ${guruId} fetching own kelas as wali kelas`);

  const kelas = await prisma.kelas.findFirst({
    where: {
      waliKelasId: guruId,
    },
    include: {
      tingkatan: true,
    },
  });

  if (!kelas) {
    throw new AppError("Anda belum ditugaskan sebagai wali kelas", 404);
  }

  const studentCount = await prisma.penempatanSiswa.count({
    where: {
      kelasId: kelas.id,
    },
  });

  return {
    ...kelas,
    jumlahSiswa: studentCount,
  };
};
