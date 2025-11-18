import { prisma } from "../config/prisma";
import { create, all } from "mathjs";
import { upsertNilaiRepo } from "../repositories/nilai.repository";
import logger from "../utils/logger";
import { NilaiKomponenType } from "../generated/prisma";

// Konfigurasi mathjs
const math = create(all);

/**
 * Menghitung ulang nilai komponen READ_ONLY untuk daftar siswa tertentu
 */
export const calculateGradesService = async (
  mapelId: string,
  siswaIds: string[]
) => {
  logger.info(`Mulai kalkulasi nilai untuk mapel ${mapelId}`);

  // 1. Ambil semua komponen nilai untuk mapel ini
  // Urutkan berdasarkan 'urutan' agar kalkulasi bertahap (misal: Rata2 dulu, baru Nilai Akhir)
  const components = await prisma.nilaiKomponen.findMany({
    where: { skema: { mapelId: mapelId } },
    orderBy: { urutan: "asc" },
  });

  const readOnlyComponents = components.filter(
    (c) => c.tipe === NilaiKomponenType.READ_ONLY
  );

  if (readOnlyComponents.length === 0) return; // Tidak ada yang perlu dihitung

  // 2. Ambil nilai yang SUDAH ADA (INPUT) untuk siswa-siswa tersebut
  const existingGrades = await prisma.nilaiDetailSiswa.findMany({
    where: {
      mapelId: mapelId,
      siswaId: { in: siswaIds },
    },
  });

  const updates: { siswaId: string; nilai: number; komponenId: string }[] = [];

  // 3. Iterasi per siswa untuk menghitung nilai
  for (const siswaId of siswaIds) {
    // a. Buat "Scope" (Daftar Variabel) untuk siswa ini
    // Contoh Scope: { "Tugas 1": 80, "Tugas 2": 90 }
    const gradesForStudent = existingGrades.filter((g) => g.siswaId === siswaId);
    
    const scope: Record<string, number> = {};
    
    // Isi scope dengan nilai yang ada
    components.forEach((comp) => {
        const grade = gradesForStudent.find((g) => g.komponenId === comp.id);
        // Jika nilai belum ada, kita asumsikan 0 agar rumus tidak error
        scope[comp.namaKomponen] = grade?.nilaiAngka || 0;
    });

    // b. Hitung setiap komponen READ_ONLY
    for (const comp of readOnlyComponents) {
      if (!comp.formula) continue;

      try {
        // Evaluasi rumus menggunakan mathjs
        // Contoh formula: "0.4 * UTS + 0.6 * UAS" atau "mean(Tugas 1, Tugas 2)"
        const result = math.evaluate(comp.formula, scope);

        // Simpan hasil ke scope agar bisa dipakai rumus berikutnya (chaining)
        // Misal: Nilai Akhir butuh Rata2 Tugas, dan Rata2 Tugas baru saja dihitung
        scope[comp.namaKomponen] = Number(result);

        // Masukkan ke antrian update
        updates.push({
            siswaId,
            komponenId: comp.id,
            nilai: Number(result.toFixed(2)) // Bulatkan 2 desimal
        });

      } catch (error) {
        logger.error(`Gagal menghitung rumus '${comp.formula}' untuk siswa ${siswaId}: ${(error as Error).message}`);
        // Lanjutkan ke komponen berikutnya, jangan crash
      }
    }
  }

  // 4. Simpan hasil perhitungan ke database secara Batch
  // Kita kelompokkan update berdasarkan komponenId agar efisien menggunakan upsertRepo kita
  for (const comp of readOnlyComponents) {
      const updatesForComp = updates.filter(u => u.komponenId === comp.id);
      if (updatesForComp.length > 0) {
          // Kita butuh guruId sistem/otomatis. 
          // Karena ini otomatisasi, kita bisa pakai ID Admin dummy atau
          // cari satu guruId dari penugasan mapel ini (opsional).
          // Untuk simplifikasi, kita cari guru pertama yang input nilai di mapel ini,
          // atau biarkan ID guru terakhir yang mengupdate (tapi repo kita butuh guruId).
          
          // Solusi Cepat: Ambil guruId dari salah satu nilai INPUT siswa tersebut
          const sampleGrade = existingGrades.find(g => g.siswaId === updatesForComp[0].siswaId);
          const systemGuruId = sampleGrade?.guruId || "system-calc"; // Fallback string

          // Konversi format data agar sesuai repository
          const dataToSave = updatesForComp.map(u => ({ siswaId: u.siswaId, nilai: u.nilai }));
          
          await upsertNilaiRepo(systemGuruId, mapelId, comp.id, dataToSave);
      }
  }
  
  logger.info(`Kalkulasi selesai. ${updates.length} nilai diperbarui.`);
};