import { upsertNilaiRepo, InputNilaiItem, getNilaiKelasRepo, getNilaiBySiswaIdRepo } from "../repositories/nilai.repository";
import logger from "../utils/logger";
import AppError from "../utils/AppError";
import { prisma } from "../config/prisma";
import { NilaiKomponenType } from "../generated/prisma";
import { calculateGradesService } from "./kalkulasi.service";

interface InputNilaiServiceInput {
  guruId: string;
  mapelId: string;
  komponenId: string;
  data: { siswaId: string; nilai: number }[];
}

export const inputNilaiService = async (input: InputNilaiServiceInput) => {
  logger.info(`Mencoba input nilai untuk mapel ${input.mapelId}, komponen ${input.komponenId}`);

  // 1. Validasi: Apakah Guru punya penugasan di mapel ini?
  // Kita cek apakah ada minimal satu penugasan guru ini di mapel ini (kelas manapun)
  // Idealnya kita filter per kelas juga, tapi untuk simplifikasi input massal, cek mapel dulu.
  const penugasan = await prisma.penugasanGuru.findFirst({
    where: {
      guruId: input.guruId,
      mapelId: input.mapelId,
    },
  });

  if (!penugasan) {
    throw new AppError("Anda tidak terdaftar sebagai pengajar mata pelajaran ini.", 403);
  }

  // 2. Validasi Komponen: Cek apakah komponen ada, milik mapel ini, dan tipe INPUT
  const komponen = await prisma.nilaiKomponen.findUnique({
    where: { id: input.komponenId },
    include: { skema: true },
  });

  if (!komponen) {
    throw new AppError("Komponen nilai tidak ditemukan.", 404);
  }

  if (komponen.skema.mapelId !== input.mapelId) {
    throw new AppError("Komponen nilai ini tidak milik mata pelajaran yang dipilih.", 400);
  }

  if (komponen.tipe !== NilaiKomponenType.INPUT) {
    throw new AppError(
      "Anda hanya dapat menginput nilai pada komponen bertipe INPUT. Komponen READ_ONLY dihitung otomatis.",
      400
    );
  }

  // 3. Simpan ke Database (INPUT values)
  const result = await upsertNilaiRepo(
    input.guruId,
    input.mapelId,
    input.komponenId,
    input.data
  );

  // 4. [BARU] Picu Kalkulasi Formula Otomatis
  // Kita ambil daftar siswaId yang nilainya baru saja berubah
  const affectedSiswaIds = input.data.map((d) => d.siswaId);
  
  // Jalankan kalkulasi (bisa dibuat async tanpa await jika ingin response cepat, 
  // tapi pakai await lebih aman untuk konsistensi data saat tes)
  await calculateGradesService(input.mapelId, affectedSiswaIds);

  return result;
};

export const getNilaiKelasService = async (guruId: string, kelasId: string, mapelId: string) => {
  // 1. Validasi Akses (Optional: Cek apakah guru mengajar di kelas ini)
  // ...

  // 2. Ambil Data dari Repo
  const { students, grades } = await getNilaiKelasRepo(kelasId, mapelId);

  // 3. Format Data untuk Frontend
  // Kita ingin return list siswa, dan di dalam tiap siswa ada map nilai per komponen
  const formattedData = students.map((p) => {
    const studentGrades = grades.filter((g) => g.siswaId === p.siswaId);
    
    // Convert array of grades to object key-value pair: { [komponenId]: nilai }
    const gradesMap: Record<string, number> = {};
    studentGrades.forEach((g) => {
      if (g.komponenId && g.nilaiAngka !== null) {
        gradesMap[g.komponenId] = g.nilaiAngka;
      }
    });

    return {
      siswaId: p.siswaId,
      nis: p.siswa.nis,
      nama: p.siswa.nama,
      grades: gradesMap,
    };
  });

  return formattedData;
};

export const getMyGradesService = async (siswaId: string) => {
  logger.info(`Fetching grades for student: ${siswaId}`);
  const grades = await getNilaiBySiswaIdRepo(siswaId);

  // Group by Mapel
  const groupedGrades: Record<string, any> = {};

  grades.forEach(g => {
    const mapelName = g.mapel.namaMapel;
    if (!groupedGrades[mapelName]) {
      groupedGrades[mapelName] = {
        mapel: mapelName,
        kategori: g.mapel.kategori,
        components: []
      };
    }

    groupedGrades[mapelName].components.push({
      komponen: g.komponen?.namaKomponen || "Unknown",
      tipe: g.komponen?.tipe,
      nilai: g.nilaiAngka,
      guru: g.guru.nama
    });
  });

  return Object.values(groupedGrades);
};