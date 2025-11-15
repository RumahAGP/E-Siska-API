import App from "../src/app";
import request from "supertest";
import { prisma } from "../src/config/prisma";

const appTest = new App().app;

describe("POST /ruangan - Create Ruangan", () => {
  // Kita gunakan Admin ID yang sudah dibuat di tes tingkatan
  const ADMIN_ID_DUMMY = "dummy-admin-id-untuk-tes";

  // Buat admin dummy jika belum ada (berguna jika tes ini dijalankan terpisah)
  beforeAll(async () => {
    await prisma.admin.upsert({
      where: { id: ADMIN_ID_DUMMY },
      update: {},
      create: {
        id: ADMIN_ID_DUMMY,
        nama: "Admin Tester Ruangan",
        user: {
          create: {
            username: "admin.test.ruangan",
            passwordHash: "dummyhash",
            role: "ADMIN",
          },
        },
      },
    });
  });

  // Bersihkan data setelah tes
  afterAll(async () => {
    await prisma.ruangan.deleteMany();
    // Kita tidak hapus admin di sini agar bisa dipakai tes lain
    // Sebaiknya ada setup/teardown global nanti
    await prisma.$disconnect();
  });

  it("Should create a new ruangan with capacity", async () => {
    const response = await request(appTest).post("/ruangan").send({
      namaRuangan: "LAB-IPA-01",
      kapasitas: 40,
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBeTruthy();
    expect(response.body.data.namaRuangan).toBe("LAB-IPA-01");
    expect(response.body.data.kapasitas).toBe(40);
  });

  it("Should create a new ruangan without capacity", async () => {
    const response = await request(appTest).post("/ruangan").send({
      namaRuangan: "Aula",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBeTruthy();
    expect(response.body.data.namaRuangan).toBe("Aula");
    expect(response.body.data.kapasitas).toBeNull();
  });

  it("Should fail if namaRuangan is empty", async () => {
    const response = await request(appTest).post("/ruangan").send({
      kapasitas: 20,
    });

    expect(response.status).toBe(400);
    expect(response.body[0].msg).toBe("Nama ruangan wajib diisi");
  });
});