import App from "../src/app";
import request from "supertest";
import { prisma } from "../src/config/prisma";
import { MataPelajaran, SkemaPenilaian } from "../src/generated/prisma";

const appTest = new App().app;

describe("POST /skema/:skemaId/komponen - Add Nilai Komponen", () => {
  const ADMIN_ID_DUMMY = "dummy-admin-id-skema-tes";
  let mapelWajib: MataPelajaran;
  let skemaWajib: SkemaPenilaian;
  let mapelEskul: MataPelajaran;
  let skemaEskul: SkemaPenilaian;

  beforeAll(async () => {
    // Buat Admin
    await prisma.admin.upsert({
      where: { id: ADMIN_ID_DUMMY },
      update: {},
      create: {
        id: ADMIN_ID_DUMMY,
        nama: "Admin Tester Skema",
        user: {
          create: {
            username: "admin.test.skema",
            passwordHash: "dummyhash",
            role: "ADMIN",
          },
        },
      },
    });

    // Buat Mapel WAJIB dan Skema-nya
    const mapel1 = await prisma.mataPelajaran.create({
      data: {
        namaMapel: "Matematika (Skema Test)",
        kategori: "WAJIB",
        adminId: ADMIN_ID_DUMMY,
        SkemaPenilaian: {
          create: { adminId: ADMIN_ID_DUMMY },
        },
      },
      include: { SkemaPenilaian: true },
    });
    mapelWajib = mapel1;
    skemaWajib = mapel1.SkemaPenilaian[0];

    // Buat Mapel ESKUL dan Skema-nya
    const mapel2 = await prisma.mataPelajaran.create({
      data: {
        namaMapel: "Pramuka (Skema Test)",
        kategori: "EKSTRAKURIKULER",
        adminId: ADMIN_ID_DUMMY,
        SkemaPenilaian: {
          create: { adminId: ADMIN_ID_DUMMY },
        },
      },
      include: { SkemaPenilaian: true },
    });
    mapelEskul = mapel2;
    skemaEskul = mapel2.SkemaPenilaian[0];
  });

  afterAll(async () => {
    await prisma.nilaiKomponen.deleteMany();
    await prisma.skemaPenilaian.deleteMany();
    await prisma.mataPelajaran.deleteMany();
    await prisma.admin.deleteMany({ where: { id: ADMIN_ID_DUMMY } });
    await prisma.user.deleteMany({ where: { username: "admin.test.skema" } });
    await prisma.$disconnect();
  });

  it("Should add an 'INPUT' component to a 'WAJIB' mapel", async () => {
    const response = await request(appTest)
      .post(`/skema/${skemaWajib.id}/komponen`)
      .send({
        namaKomponen: "Tugas 1",
        tipe: "INPUT",
        urutan: 1,
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBeTruthy();
    expect(response.body.data.namaKomponen).toBe("Tugas 1");
    expect(response.body.data.tipe).toBe("INPUT");
    expect(response.body.data.formula).toBeNull();
  });

  it("Should add a 'READ_ONLY' component with formula", async () => {
    const response = await request(appTest)
      .post(`/skema/${skemaWajib.id}/komponen`)
      .send({
        namaKomponen: "Rata-Rata Tugas",
        tipe: "READ_ONLY",
        urutan: 2,
        formula: "mean(Tugas 1, Tugas 2)",
      });

    expect(response.status).toBe(201);
    expect(response.body.data.namaKomponen).toBe("Rata-Rata Tugas");
    expect(response.body.data.tipe).toBe("READ_ONLY");
    expect(response.body.data.formula).toBe("mean(Tugas 1, Tugas 2)");
  });

  it("Should fail to add 'READ_ONLY' component without formula", async () => {
    const response = await request(appTest)
      .post(`/skema/${skemaWajib.id}/komponen`)
      .send({
        namaKomponen: "Nilai Akhir",
        tipe: "READ_ONLY", // Lupa formula
        urutan: 3,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Komponen Tipe READ_ONLY wajib memiliki formula",
    );
  });

  it("Should fail to add 'INPUT' component with formula", async () => {
    const response = await request(appTest)
      .post(`/skema/${skemaWajib.id}/komponen`)
      .send({
        namaKomponen: "Tugas 2",
        tipe: "INPUT",
        urutan: 4,
        formula: "salah_nih", // INPUT tidak boleh ada formula
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Komponen Tipe INPUT tidak boleh memiliki formula",
    );
  });

  it("Should fail to add component to 'EKSTRAKURIKULER' mapel", async () => {
    const response = await request(appTest)
      .post(`/skema/${skemaEskul.id}/komponen`) // Coba ke skema Eskul
      .send({
        namaKomponen: "Kehadiran",
        tipe: "INPUT",
        urutan: 1,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Tidak dapat menambah komponen nilai ke mapel Ekstrakurikuler",
    );
  });
});