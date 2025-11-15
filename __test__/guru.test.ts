import App from "../src/app";
import request from "supertest";
import { prisma } from "../src/config/prisma";

const appTest = new App().app;

describe("POST /guru - Create Guru", () => {
  // Bersihkan data guru dan user terkait setelah tes
  afterAll(async () => {
    // Hapus guru dan user yang mungkin dibuat
    // Hati-hati jika ada data lain, ini akan menghapus semua GURU dan SISWA
    await prisma.guru.deleteMany();
    await prisma.siswa.deleteMany();
    await prisma.user.deleteMany({
        where: {
            role: { in: ['GURU', 'SISWA'] }
        }
    });
    await prisma.$disconnect();
  });

  it("Should create a new guru and user account", async () => {
    const nip = "G-123456";
    const username = "guru.test";
    const response = await request(appTest).post("/guru").send({
      nama: "Guru Uji Coba",
      nip: nip,
      email: "guru.test@sekolah.id",
      username: username,
      passwordDefault: "password123",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBeTruthy();
    expect(response.body.data.guru.nama).toBe("Guru Uji Coba");
    expect(response.body.data.guru.nip).toBe(nip);
    expect(response.body.data.user.username).toBe(username);
    expect(response.body.data.user.role).toBe("GURU");
  });

  it("Should fail if NIP is empty", async () => {
    const response = await request(appTest).post("/guru").send({
      nama: "Guru Gagal",
      username: "guru.gagal",
      passwordDefault: "password123",
    });

    expect(response.status).toBe(400); // 400 dari validator
    expect(response.body[0].msg).toBe("NIP wajib diisi");
  });

  it("Should fail if password is too short", async () => {
    const response = await request(appTest).post("/guru").send({
      nama: "Guru Gagal 2",
      nip: "G-987654",
      username: "guru.gagal2",
      passwordDefault: "123", // Kurang dari 6
    });

    expect(response.status).toBe(400);
    expect(response.body[0].msg).toBe("Password default minimal 6 karakter");
  });
});