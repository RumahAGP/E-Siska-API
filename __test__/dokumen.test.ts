import App from "../src/app";
import request from "supertest";
import path from "path"; // Untuk mengambil path file dummy
import { prisma } from "../src/config/prisma";
import { User } from "../src/generated/prisma";

const appTest = new App().app;

// Mock cloudinaryUpload agar tidak benar-benar mengupload ke Cloudinary saat tes
jest.mock("../src/config/cloudinary", () => ({
  cloudinaryUpload: jest.fn(() =>
    Promise.resolve({
      secure_url: "http://dummy.cloudinary.com/file.pdf",
    }),
  ),
}));

describe("POST /dokumen - Upload Dokumen", () => {
  const ADMIN_ID_DUMMY = "dummy-admin-id-dokumen";
  let adminUserTest: User;

  beforeAll(async () => {
    // Pastikan admin dummy dan user-nya ada
    const adminData = await prisma.admin.upsert({
      where: { id: ADMIN_ID_DUMMY },
      update: {},
      create: {
        id: ADMIN_ID_DUMMY,
        nama: "Admin Tester Dokumen",
        user: {
          create: {
            username: "admin.test.dokumen",
            passwordHash: "dummyhash",
            role: "ADMIN",
          },
        },
      },
      include: { user: true },
    });
    adminUserTest = adminData.user;

    // Ganti dummy-admin-id-untuk-tes dengan ID yang benar
    // (Ini adalah hack sementara karena kita hardcode ID di service)
    await prisma.admin.upsert({
      where: { id: "dummy-admin-id-untuk-tes" },
      update: {},
      create: {
        id: "dummy-admin-id-untuk-tes",
        nama: "Admin Dummy for Dokumen Service",
        userId: adminUserTest.id, // Gunakan user ID dari adminUserTest
      },
    });
  });

  afterAll(async () => {
    await prisma.dokumen.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
    jest.restoreAllMocks(); // Kembalikan mock
  });

  it("Should upload a document successfully", async () => {
    // Buat file dummy (atau gunakan file yang ada di repo tes)
    const dummyFilePath = path.resolve(__dirname, "app.test.ts"); // Pakai file tes ini sbg dummy

    const response = await request(appTest)
      .post("/dokumen")
      .field("judul", "Panduan Belajar") // Kirim field 'judul'
      .attach("file", dummyFilePath); // Lampirkan file

    expect(response.status).toBe(201);
    expect(response.body.success).toBeTruthy();
    expect(response.body.data.judul).toBe("Panduan Belajar");
    expect(response.body.data.urlFile).toBe(
      "http://dummy.cloudinary.com/file.pdf",
    );
  });

  it("Should fail if no file is attached", async () => {
    const response = await request(appTest)
      .post("/dokumen")
      .field("judul", "Gagal Upload");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("File dokumen wajib diupload");
  });

  it("Should fail if judul is empty", async () => {
    const dummyFilePath = path.resolve(__dirname, "app.test.ts");
    const response = await request(appTest)
      .post("/dokumen")
      .attach("file", dummyFilePath); // Hanya attach file

    expect(response.status).toBe(400);
    expect(response.body[0].msg).toBe("Judul dokumen wajib diisi");
  });
});