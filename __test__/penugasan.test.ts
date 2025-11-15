import App from "../src/app";
import request from "supertest";
import { prisma } from "../src/config/prisma";
import { Guru, MataPelajaran, Kelas } from "../src/generated/prisma";

const appTest = new App().app;

describe("POST /penugasan-guru - Create Penugasan Guru", () => {
  let guruTest: Guru;
  let mapelTest: MataPelajaran;
  let kelasTest: Kelas;
  const ADMIN_ID_DUMMY = "dummy-admin-id-penugasan";

  beforeAll(async () => {
    // 1. Buat Admin
    await prisma.admin.upsert({
      where: { id: ADMIN_ID_DUMMY },
      update: {},
      create: {
        id: ADMIN_ID_DUMMY,
        nama: "Admin Tester Penugasan",
        user: {
          create: {
            username: "admin.test.penugasan",
            passwordHash: "dummyhash",
            role: "ADMIN",
          },
        },
      },
    });
    // 2. Buat Guru
    guruTest = (
      await prisma.guru.create({
        data: {
          nip: "G-PENUGASAN-001",
          nama: "Guru Penugasan",
          user: {
            create: {
              username: "guru.penugasan",
              passwordHash: "dummyhash",
              role: "GURU",
            },
          },
        },
      })
    );
    // 3. Buat Mapel
    mapelTest = (
      await prisma.mataPelajaran.create({
        data: {
          namaMapel: "Mapel Penugasan",
          kategori: "WAJIB",
          adminId: ADMIN_ID_DUMMY,
          SkemaPenilaian: { create: { adminId: ADMIN_ID_DUMMY } },
        },
      })
    );
    // 4. Buat Tingkatan & Kelas
    const tingkatan = await prisma.tingkatanKelas.create({
      data: { namaTingkat: "Tingkat Penugasan", adminId: ADMIN_ID_DUMMY },
    });
    kelasTest = await prisma.kelas.create({
      data: {
        namaKelas: "Kelas Penugasan",
        tingkatanId: tingkatan.id,
      },
    });
  });

  afterAll(async () => {
    // Hapus data dengan urutan terbalik
    await prisma.penugasanGuru.deleteMany();
    await prisma.skemaPenilaian.deleteMany();
    await prisma.mataPelajaran.deleteMany();
    await prisma.guru.deleteMany();
    await prisma.kelas.deleteMany();
    await prisma.tingkatanKelas.deleteMany();
    await prisma.admin.deleteMany({ where: { id: ADMIN_ID_DUMMY } });
    await prisma.user.deleteMany({
      where: {
        username: { in: ["admin.test.penugasan", "guru.penugasan"] },
      },
    });
    await prisma.$disconnect();
  });

  it("Should successfully assign a teacher to a class/subject", async () => {
    const response = await request(appTest).post("/penugasan-guru").send({
      guruId: guruTest.id,
      mapelId: mapelTest.id,
      kelasId: kelasTest.id,
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBeTruthy();
    expect(response.body.data.guruId).toBe(guruTest.id);
  });

  it("Should fail if the assignment already exists", async () => {
    const response = await request(appTest).post("/penugasan-guru").send({
      guruId: guruTest.id, // Penugasan yang sama
      mapelId: mapelTest.id, // Penugasan yang sama
      kelasId: kelasTest.id, // Penugasan yang sama
    });

    expect(response.status).toBe(409); // 409 Conflict
    expect(response.body.message).toContain("sudah ditugaskan");
  });

  it("Should fail if guruId is invalid", async () => {
    const response = await request(appTest).post("/penugasan-guru").send({
      guruId: "bukan-uuid",
      mapelId: mapelTest.id,
      kelasId: kelasTest.id,
    });

    expect(response.status).toBe(400);
    expect(response.body[0].msg).toBe("Format guruId tidak valid");
  });
});