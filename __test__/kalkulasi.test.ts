import App from "../src/app";
import request from "supertest";
import { prisma } from "../src/config/prisma";
import { Guru, MataPelajaran, NilaiKomponen, Siswa } from "../src/generated/prisma";

const appTest = new App().app;

describe("Auto Calculation Service", () => {
  const ADMIN_ID_DUMMY = "dummy-admin-id-calc";
  let guruTest: Guru;
  let mapelTest: any; // any untuk bypass issue tipe relasi
  let compTugas1: NilaiKomponen;
  let compTugas2: NilaiKomponen;
  let compRataRata: NilaiKomponen; // READ_ONLY: mean(Tugas 1, Tugas 2)
  let siswaTest: Siswa;

  beforeAll(async () => {
    // 1. Setup Data Master
    await prisma.admin.upsert({ where: { id: ADMIN_ID_DUMMY }, update: {}, create: { id: ADMIN_ID_DUMMY, nama: "Admin Calc", user: { create: { username: "admin.calc", passwordHash: "hash", role: "ADMIN" } } } });
    guruTest = await prisma.guru.create({ data: { nama: "Guru Calc", nip: "G-CALC", user: { create: { username: "guru.calc", passwordHash: "hash", role: "GURU" } } } });
    
    // 2. Setup Mapel & Skema (Kompleks)
    // Skenario: Nilai Akhir = Rata-rata(Tugas 1, Tugas 2)
    mapelTest = await prisma.mataPelajaran.create({
      data: {
        namaMapel: "Matematika Lanjut",
        kategori: "WAJIB",
        adminId: ADMIN_ID_DUMMY,
        SkemaPenilaian: {
          create: {
            adminId: ADMIN_ID_DUMMY,
            Komponen: {
              createMany: {
                data: [
                  { namaKomponen: "Tugas 1", tipe: "INPUT", urutan: 1 },
                  { namaKomponen: "Tugas 2", tipe: "INPUT", urutan: 2 },
                  // Formula menggunakan nama komponen persis
                  { namaKomponen: "Nilai Akhir", tipe: "READ_ONLY", urutan: 3, formula: "mean(Tugas 1, Tugas 2)" }
                ]
              }
            }
          }
        }
      },
      include: { SkemaPenilaian: { include: { Komponen: true } } }
    });

    const comps = mapelTest.SkemaPenilaian?.[0]?.Komponen;
    compTugas1 = comps.find((c: any) => c.namaKomponen === "Tugas 1");
    compTugas2 = comps.find((c: any) => c.namaKomponen === "Tugas 2");
    compRataRata = comps.find((c: any) => c.namaKomponen === "Nilai Akhir");

    // 3. Kelas & Penugasan
    const tingkatan = await prisma.tingkatanKelas.create({ data: { namaTingkat: "Tingkat Calc", adminId: ADMIN_ID_DUMMY } });
    const kelas = await prisma.kelas.create({ data: { namaKelas: "Kelas Calc", tingkatanId: tingkatan.id } });
    await prisma.penugasanGuru.create({ data: { guruId: guruTest.id, mapelId: mapelTest.id, kelasId: kelas.id } });

    // 4. Siswa
    siswaTest = await prisma.siswa.create({ data: { nama: "Siswa Pintar", nis: "S-CALC", user: { create: { username: "s.calc", passwordHash: "hash", role: "SISWA" } } } });
  });

  afterAll(async () => {
    await prisma.nilaiDetailSiswa.deleteMany();
    await prisma.penugasanGuru.deleteMany();
    await prisma.nilaiKomponen.deleteMany();
    await prisma.skemaPenilaian.deleteMany();
    await prisma.mataPelajaran.deleteMany();
    await prisma.siswa.deleteMany();
    await prisma.kelas.deleteMany();
    await prisma.tingkatanKelas.deleteMany();
    await prisma.guru.deleteMany();
    await prisma.admin.deleteMany({ where: { id: ADMIN_ID_DUMMY } });
    await prisma.user.deleteMany({ where: { username: { in: ["admin.calc", "guru.calc", "s.calc"] } } });
    await prisma.$disconnect();
  });

  it("Should automatically calculate READ_ONLY grade", async () => {
    // 1. Input Nilai Tugas 1 = 80
    await request(appTest).post("/nilai").send({
      guruId: guruTest.id, mapelId: mapelTest.id, komponenId: compTugas1.id,
      data: [{ siswaId: siswaTest.id, nilai: 80 }]
    });

    // 2. Input Nilai Tugas 2 = 90
    await request(appTest).post("/nilai").send({
      guruId: guruTest.id, mapelId: mapelTest.id, komponenId: compTugas2.id,
      data: [{ siswaId: siswaTest.id, nilai: 90 }]
    });

    // 3. Cek Database: Apakah 'Nilai Akhir' (mean(80, 90) = 85) otomatis terisi?
    const nilaiAkhir = await prisma.nilaiDetailSiswa.findUnique({
      where: {
        siswaId_mapelId_komponenId: {
          siswaId: siswaTest.id,
          mapelId: mapelTest.id,
          komponenId: compRataRata.id
        }
      }
    });

    expect(nilaiAkhir).toBeDefined();
    expect(nilaiAkhir?.nilaiAngka).toBe(85); // (80+90)/2 = 85
  });
});