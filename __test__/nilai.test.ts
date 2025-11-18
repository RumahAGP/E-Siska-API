import App from "../src/app";
import request from "supertest";
import { prisma } from "../src/config/prisma";
import { Guru, NilaiKomponen, Siswa } from "../src/generated/prisma";

const appTest = new App().app;

describe("POST /nilai - Input Nilai Siswa", () => {
  const ADMIN_ID_DUMMY = "dummy-admin-id-nilai";
  let guruTest: Guru;
  // [PERBAIKAN 1]: Ubah tipe ke 'any' agar bisa mengakses properti hasil include (SkemaPenilaian)
  let mapelTest: any; 
  let komponenInput: NilaiKomponen;
  let komponenReadOnly: NilaiKomponen;
  let siswaTest: Siswa;

  beforeAll(async () => {
    // 1. Setup Admin
    await prisma.admin.upsert({
        where: { id: ADMIN_ID_DUMMY },
        update: {},
        create: { id: ADMIN_ID_DUMMY, nama: "Admin Nilai", user: { create: { username: "admin.nilai", passwordHash: "hash", role: "ADMIN" } } },
    });
    // 2. Setup Guru
    guruTest = await prisma.guru.create({ data: { nama: "Guru Nilai", nip: "G-NILAI", user: { create: { username: "guru.nilai", passwordHash: "hash", role: "GURU" } } } });
    
    // 3. Setup Mapel & Skema dengan 2 Komponen (INPUT & READ_ONLY)
    mapelTest = await prisma.mataPelajaran.create({
      data: {
        namaMapel: "Fisika",
        kategori: "WAJIB",
        adminId: ADMIN_ID_DUMMY,
        SkemaPenilaian: {
          create: {
            adminId: ADMIN_ID_DUMMY,
            Komponen: {
              createMany: {
                data: [
                  { namaKomponen: "Tugas", tipe: "INPUT", urutan: 1 },
                  { namaKomponen: "Nilai Akhir", tipe: "READ_ONLY", urutan: 2, formula: "Tugas" }
                ]
              }
            }
          }
        }
      },
      include: { SkemaPenilaian: { include: { Komponen: true } } }
    });

    // [PERBAIKAN 2]: Tambahkan optional chaining (?.) dan tipe eksplisit (k: any)
    const komponen = mapelTest.SkemaPenilaian?.[0]?.Komponen;
    
    komponenInput = komponen?.find((k: any) => k.tipe === "INPUT");
    komponenReadOnly = komponen?.find((k: any) => k.tipe === "READ_ONLY");

    // 4. Setup Kelas & Penugasan
    const tingkatan = await prisma.tingkatanKelas.create({ data: { namaTingkat: "Tingkat Nilai", adminId: ADMIN_ID_DUMMY } });
    const kelas = await prisma.kelas.create({ data: { namaKelas: "Kelas Nilai", tingkatanId: tingkatan.id } });
    
    await prisma.penugasanGuru.create({
      data: { guruId: guruTest.id, mapelId: mapelTest.id, kelasId: kelas.id }
    });

    // 5. Setup Siswa
    siswaTest = await prisma.siswa.create({ data: { nama: "Siswa Nilai", nis: "S-NILAI", user: { create: { username: "s.nilai", passwordHash: "hash", role: "SISWA" } } } });
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
    await prisma.user.deleteMany({ where: { username: { in: ["admin.nilai", "guru.nilai", "s.nilai"] } } });
    await prisma.$disconnect();
  });

  it("Should submit grades for INPUT component successfully", async () => {
    const response = await request(appTest).post("/nilai").send({
      guruId: guruTest.id,
      mapelId: mapelTest.id,
      komponenId: komponenInput.id,
      data: [{ siswaId: siswaTest.id, nilai: 85 }]
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBeTruthy();
    
    const savedData = await prisma.nilaiDetailSiswa.findFirst({ where: { siswaId: siswaTest.id } });
    expect(savedData?.nilaiAngka).toBe(85);
  });

  it("Should fail if component is READ_ONLY", async () => {
    const response = await request(appTest).post("/nilai").send({
      guruId: guruTest.id,
      mapelId: mapelTest.id,
      komponenId: komponenReadOnly.id, // Ini READ_ONLY
      data: [{ siswaId: siswaTest.id, nilai: 90 }]
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("hanya dapat menginput nilai pada komponen bertipe INPUT");
  });

  it("Should fail if guru is not assigned", async () => {
    // Buat guru lain tanpa penugasan
    const guruAsing = await prisma.guru.create({ data: { nama: "Guru Asing", nip: "G-ASING", user: { create: { username: "guru.asing", passwordHash: "hash", role: "GURU" } } } });

    const response = await request(appTest).post("/nilai").send({
      guruId: guruAsing.id,
      mapelId: mapelTest.id,
      komponenId: komponenInput.id,
      data: [{ siswaId: siswaTest.id, nilai: 80 }]
    });

    expect(response.status).toBe(403);
    expect(response.body.message).toContain("tidak terdaftar sebagai pengajar");

    await prisma.guru.delete({ where: { id: guruAsing.id } });
    await prisma.user.delete({ where: { username: "guru.asing" } });
  });
});