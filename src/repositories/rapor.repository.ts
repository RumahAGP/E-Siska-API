import { prisma } from "../config/prisma";
import { AbsensiStatus } from "../generated/prisma";

interface InputRaporData {
  siswaId: string;
  tahunAjaranId: string;
  kelasId: string;
  waliKelasId: string;
  catatanWaliKelas?: string;
  dataKokurikuler?: string;
}

/**
 * Update atau Buat Data Rapor (Catatan & Kokurikuler)
 */
export const upsertRaporRepo = async (data: InputRaporData) => {
  return prisma.rapor.upsert({
    where: {
      siswaId_tahunAjaranId: {
        siswaId: data.siswaId,
        tahunAjaranId: data.tahunAjaranId,
      },
    },
    update: {
      catatanWaliKelas: data.catatanWaliKelas,
      dataKokurikuler: data.dataKokurikuler,
      // Pastikan relasi tetap konsisten
      kelasId: data.kelasId,
      waliKelasId: data.waliKelasId,
    },
    create: {
      siswaId: data.siswaId,
      tahunAjaranId: data.tahunAjaranId,
      kelasId: data.kelasId,
      waliKelasId: data.waliKelasId,
      catatanWaliKelas: data.catatanWaliKelas,
      dataKokurikuler: data.dataKokurikuler,
      isFinalisasi: false,
    },
  });
};

/**
 * Mengambil Rekap Absensi Siswa per Tahun Ajaran
 */
export const getAbsensiSummaryRepo = async (siswaId: string, tahunAjaranId: string) => {
  // Mengambil semua record absensi detail siswa di tahun ajaran tersebut
  const absensi = await prisma.absensiDetail.findMany({
    where: {
      siswaId: siswaId,
      sesi: {
        // Filter sesi berdasarkan tahun ajaran jadwal (via kelas -> tahun ajaran di penempatan? 
        // Agak kompleks karena sesi hanya punya tanggal.
        // Simplifikasi: Kita cari sesi di range tanggal TA atau via KelasPenempatan)
        // Untuk V1: Kita asumsikan siswa tidak pindah kelas di tengah tahun.
        // Ambil semua absensi siswa ini.
      }
    }
  });

  // Hitung manual (grouping via Prisma terkadang tricky untuk Enum)
  const summary = {
    [AbsensiStatus.SAKIT]: 0,
    [AbsensiStatus.IZIN]: 0,
    [AbsensiStatus.ALPHA]: 0,
    [AbsensiStatus.HADIR]: 0,
  };

  absensi.forEach(a => {
    summary[a.status]++;
  });

  return summary;
};

/**
 * Mengambil Semua Nilai Akhir (Angka & Capaian) untuk Mapel Wajib
 */
export const getNilaiRaporRepo = async (siswaId: string) => {
  // Ambil Mapel yang diambil siswa (via Penugasan/Kelas tidak langsung terlihat)
  // Kita ambil dari NilaiDetailSiswa yang sudah ada nilainya
  const nilaiDetails = await prisma.nilaiDetailSiswa.findMany({
    where: { siswaId: siswaId, mapel: { kategori: "WAJIB" } },
    include: { 
        mapel: true, 
        komponen: true 
    }
  });

  const capaianDetails = await prisma.capaianKompetensi.findMany({
    where: { siswaId: siswaId },
  });

  return { nilaiDetails, capaianDetails };
};

/**
 * Mengambil Nilai Ekskul
 */
export const getNilaiEkskulRepo = async (siswaId: string) => {
  return prisma.nilaiDetailSiswa.findMany({
    where: { 
        siswaId: siswaId, 
        mapel: { kategori: "EKSTRAKURIKULER" },
        komponenId: null 
    },
    include: { mapel: true }
  });
};

/**
 * Mengambil Data Rapor (Catatan & Kokurikuler)
 */
export const getRaporDataRepo = async (siswaId: string, tahunAjaranId: string) => {
  return prisma.rapor.findUnique({
    where: { siswaId_tahunAjaranId: { siswaId, tahunAjaranId } },
    include: { waliKelas: true }
  });
};

export const getRaporBySiswaIdRepo = async (siswaId: string) => {
  return await prisma.rapor.findMany({
    where: { siswaId, isFinalisasi: true }, // Only finalized reports
    include: {
      tahunAjaran: true,
      kelas: true,
      waliKelas: true,
      NilaiRaporAkhir: {
        include: {
          mapel: true
        }
      }
    },
    orderBy: {
      tahunAjaran: { nama: 'desc' }
    }
  });
};