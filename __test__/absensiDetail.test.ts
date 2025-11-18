import App from "../src/app";
import request from "supertest";
import { prisma } from "../src/config/prisma";
import { AbsensiSesi, Siswa } from "../src/generated/prisma";

const appTest = new App().app;

describe("POST /absensi/sesi/:sesiId/detail - Input Detail Absensi", () => {
  let sesiTest: AbsensiSesi;
  let siswa1: Siswa;
  let siswa2: Siswa;
  const ADMIN_ID_DUMMY = "dummy-admin-id-absensi-detail";

  beforeAll(async () => {
    // 1. Setup Admin, Guru, Kelas, Mapel (Sama seperti absensi.test.ts)
    await prisma.admin.upsert({
        where: { id: ADMIN_ID_DUMMY },
        update: {},
        create: { id: ADMIN_ID_DUMMY, nama: "Admin Absensi Detail", user: { create: { username: "admin.abs.det", passwordHash: "hash", role: "ADMIN" } } },
    });
    const guru = await prisma.guru.create({
        data: { nama: "Guru Absensi Detail", nip: "G-ABS-DET", user: { create: { username: "guru.abs.det", passwordHash: "hash", role: "GURU" } } },
    });
    const tingkatan = await prisma.tingkatanKelas.create({ data: { namaTingkat: "Tingkat Abs Det", adminId: ADMIN_ID_DUMMY } });
    const kelas = await prisma.kelas.create({ data: { namaKelas: "Kelas Abs Det", tingkatanId: tingkatan.id } });
    
    // 2. Buat 2 Siswa
    siswa1 = await prisma.siswa.create({ data: { nama: "Siswa A", nis: "S001", user: { create: { username: "S001", passwordHash: "hash", role: "SISWA" } } } });
    siswa2 = await prisma.siswa.create({ data: { nama: "Siswa B", nis: "S002", user: { create: { username: "S002", passwordHash: "hash", role: "SISWA" } } } });

    // 3. Buat Sesi Absensi Manual
    sesiTest = await prisma.absensiSesi.create({
        data: {
            guruId: guru.id,
            kelasId: kelas.id,
            tanggal: new Date(),
            pertemuanKe: 1
        }
    });
  });

  afterAll(async () => {
    await prisma.absensiDetail.deleteMany();
    await prisma.absensiSesi.deleteMany();
    await prisma.siswa.deleteMany();
    await prisma.kelas.deleteMany();
    await prisma.tingkatanKelas.deleteMany();
    await prisma.guru.deleteMany();
    await prisma.admin.deleteMany({ where: { id: ADMIN_ID_DUMMY } });
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("Should submit attendance details successfully", async () => {
    const response = await request(appTest)
      .post(`/absensi/sesi/${sesiTest.id}/detail`)
      .send({
        data: [
          { siswaId: siswa1.id, status: "HADIR" },
          { siswaId: siswa2.id, status: "SAKIT" },
        ],
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBeTruthy();
    expect(response.body.totalData).toBe(2);
    
    // Cek di database apakah tersimpan
    const savedData = await prisma.absensiDetail.findMany({ where: { sesiId: sesiTest.id } });
    expect(savedData).toHaveLength(2);
  });

  it("Should update attendance if submitted again (Upsert)", async () => {
    // Ubah status siswa1 jadi IZIN
    const response = await request(appTest)
      .post(`/absensi/sesi/${sesiTest.id}/detail`)
      .send({
        data: [
          { siswaId: siswa1.id, status: "IZIN" }, 
        ],
      });

    expect(response.status).toBe(200);
    
    const updatedData = await prisma.absensiDetail.findUnique({
        where: { siswaId_sesiId: { siswaId: siswa1.id, sesiId: sesiTest.id } }
    });
    expect(updatedData?.status).toBe("IZIN");
  });

  it("Should fail if status is invalid", async () => {
    const response = await request(appTest)
      .post(`/absensi/sesi/${sesiTest.id}/detail`)
      .send({
        data: [
          { siswaId: siswa1.id, status: "BOLOS" }, // Invalid Enum
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body[0].msg).toContain("Status harus salah satu dari");
  });
});