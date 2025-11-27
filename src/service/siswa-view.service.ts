import { prisma } from "../config/prisma";
import AppError from "../utils/AppError";
import logger from "../utils/logger";

export const getMyAbsensiService = async (
  siswaId: string,
  tahunAjaranId?: string
) => {
  logger.info(`Fetching attendance for siswa: ${siswaId}`);

  const penempatan = await prisma.penempatanSiswa.findFirst({
    where: {
      siswaId: siswaId,
      ...(tahunAjaranId && { tahunAjaranId }),
    },
    include: {
      kelas: true,
      tahunAjaran: true,
    },
  });

  if (!penempatan) {
    throw new AppError("Penempatan siswa tidak ditemukan", 404);
  }

  const absensiDetails = await prisma.absensiDetail.findMany({
    where: {
      siswaId: siswaId,
      sesi: {
        kelasId: penempatan.kelasId,
      },
    },
    include: {
      sesi: true,
    },
    orderBy: {
      sesi: {
        tanggal: "desc",
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
    kelas: penempatan.kelas,
    tahunAjaran: penempatan.tahunAjaran,
    summary,
    details: absensiDetails,
  };
};

export const getMyNilaiService = async (
  siswaId: string,
  tahunAjaranId?: string
) => {
  logger.info(`Fetching grades for siswa: ${siswaId}`);

  const penempatan = await prisma.penempatanSiswa.findFirst({
    where: {
      siswaId: siswaId,
      ...(tahunAjaranId && { tahunAjaranId }),
    },
    include: {
      kelas: {
        include: {
          tingkatan: true,
        },
      },
      tahunAjaran: true,
    },
  });

  if (!penempatan) {
    throw new AppError("Penempatan siswa tidak ditemukan", 404);
  }

  const nilaiDetail = await prisma.nilaiDetailSiswa.findMany({
    where: {
      siswaId: siswaId,
    },
    include: {
      komponen: {
        include: {
          skema: {
            include: {
              mapel: true,
            },
          },
        },
      },
      mapel: true,
    },
  });

  const capaianKompetensi = await prisma.capaianKompetensi.findMany({
    where: {
      siswaId: siswaId,
    },
    include: {
      mapel: true,
    },
  });

  const rapor = await prisma.rapor.findFirst({
    where: {
      siswaId: siswaId,
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
    kelas: penempatan.kelas,
    tahunAjaran: penempatan.tahunAjaran,
    nilaiDetail: nilaiDetail,
    capaianKompetensi: capaianKompetensi,
    nilaiAkhir: rapor?.NilaiRaporAkhir || [],
  };
};

export const getMyJadwalService = async (siswaId: string) => {
  logger.info(`Fetching schedule for siswa: ${siswaId}`);

  const penempatan = await prisma.penempatanSiswa.findFirst({
    where: {
      siswaId: siswaId,
    },
    include: {
      kelas: true,
      tahunAjaran: true,
    },
  });

  if (!penempatan) {
    throw new AppError("Penempatan siswa tidak ditemukan", 404);
  }

  const jadwal = await prisma.jadwal.findMany({
    where: {
      kelasId: penempatan.kelasId,
      tahunAjaranId: penempatan.tahunAjaranId,
    },
    include: {
      mapel: true,
      guru: true,
      ruangan: true,
    },
    orderBy: [{ hari: "asc" }, { waktuMulai: "asc" }],
  });

  return {
    kelas: penempatan.kelas,
    tahunAjaran: penempatan.tahunAjaran,
    jadwal: jadwal,
  };
};

export const getPengumumanService = async () => {
  logger.info("Fetching all pengumuman");

  const pengumuman = await prisma.pengumuman.findMany({
    orderBy: {
      tanggalPublikasi: "desc",
    },
    take: 50,
  });

  return pengumuman;
};

export const getDokumenService = async () => {
  logger.info("Fetching all dokumen");

  const dokumen = await prisma.dokumen.findMany({
    select: {
      id: true,
      judul: true,
      urlFile: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return dokumen;
};
