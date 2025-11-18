import App from "../src/app";
import request from "supertest";
import { prisma } from "../src/config/prisma";
import { Guru, Siswa, Kelas, TahunAjaran } from "../src/generated/prisma";

const appTest = new App().app;

describe("PUT /rapor/siswa/:siswaId - Manajemen Data Rapor", () => {
  const ADMIN_ID_DUMMY = "dummy-admin-id-rapor";
  let waliKelas: Guru;
  let guruBiasa: Guru;
  let siswaTest: Siswa;
  let taTest: TahunAjaran;
  let kelasTest: Kelas;

  beforeAll(async () => {
    // 1. Setup Admin
    await prisma.admin.upsert({ where: { id: ADMIN_ID_DUMMY }, update: {}, create: { id: ADMIN_ID_DUMMY, nama: "Admin Rapor", user: { create: { username: "admin.rapor", passwordHash: "hash", role: "ADMIN" } } } });
    
    // 2. Setup Guru (Wali Kelas & Guru Biasa)
    waliKelas = await prisma.guru.create({ data: { nama: "Wali Kelas 10A", nip: "G-WALI", user: { create: { username: "wali.kelas", passwordHash: "hash", role: "GURU" } } } });
    guruBiasa = await prisma.guru.create({ data: { nama: "Guru Biasa", nip: "G-BIASA", user: { create: { username: "guru.biasa", passwordHash: "hash", role: "GURU" } } } });

    // 3. Setup Tingkatan, Kelas, TA
    const tingkatan = await prisma.tingkatanKelas.create({ data: { namaTingkat: "Tingkat Rapor", adminId: ADMIN_ID_DUMMY } });
    kelasTest = await prisma.kelas.create({ 
        data: { 
            namaKelas: "Kelas Rapor", 
            tingkatanId: tingkatan.id,
            waliKelasId: waliKelas.id // SET WALI KELAS DI SINI
        } 
    });
    taTest = await prisma.tahunAjaran.create({ data: { nama: "TA Rapor", adminId: ADMIN_ID_DUMMY } });

    // 4. Setup Siswa & Penempatan
    siswaTest = await prisma.siswa.create({ data: { nama: "Siswa Rapor", nis: "S-RAPOR", user: { create: { username: "s.rapor", passwordHash: "hash", role: "SISWA" } } } });
    
    await prisma.penempatanSiswa.create({
        data: { siswaId: siswaTest.id, kelasId: kelasTest.id, tahunAjaranId: taTest.id }
    });
  });

  afterAll(async () => {
    await prisma.rapor.deleteMany();
    await prisma.penempatanSiswa.deleteMany();
    await prisma.siswa.deleteMany();
    await prisma.kelas.deleteMany();
    await prisma.tingkatanKelas.deleteMany();
    await prisma.guru.deleteMany();
    await prisma.tahunAjaran.deleteMany();
    await prisma.admin.deleteMany({ where: { id: ADMIN_ID_DUMMY } });
    await prisma.user.deleteMany({ where: { username: { in: ["admin.rapor", "wali.kelas", "guru.biasa", "s.rapor"] } } });
    await prisma.$disconnect();
  });

  it("Should allow Wali Kelas to update rapor data", async () => {
    const response = await request(appTest).put(`/rapor/siswa/${siswaTest.id}`).send({
      guruId: waliKelas.id,
      tahunAjaranId: taTest.id,
      catatan: "Tingkatkan prestasimu!",
      kokurikuler: "Pramuka: Aktif"
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBeTruthy();
    expect(response.body.data.catatanWaliKelas).toBe("Tingkatkan prestasimu!");
  });

  it("Should forbid non-Wali Kelas from updating rapor", async () => {
    const response = await request(appTest).put(`/rapor/siswa/${siswaTest.id}`).send({
      guruId: guruBiasa.id, // BUKAN Wali Kelas
      tahunAjaranId: taTest.id,
      catatan: "Saya bajak rapor ini"
    });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Anda bukan Wali Kelas dari siswa ini.");
  });
});