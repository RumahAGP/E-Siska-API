/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `is_first_login` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `AcademicCalendar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Announcement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Attendance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Class` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Grade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Report` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Schedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Teacher` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'GURU', 'SISWA');

-- CreateEnum
CREATE TYPE "MapelCategory" AS ENUM ('WAJIB', 'MUATAN_LOKAL', 'EKSTRAKURIKULER');

-- CreateEnum
CREATE TYPE "NilaiKomponenType" AS ENUM ('INPUT', 'READ_ONLY');

-- CreateEnum
CREATE TYPE "AbsensiStatus" AS ENUM ('HADIR', 'SAKIT', 'IZIN', 'ALPHA');

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Bill" DROP CONSTRAINT "Bill_paymentTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Bill" DROP CONSTRAINT "Bill_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_homeroomTeacherId_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_classId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_classId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_userId_fkey";

-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_userId_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "is_first_login",
DROP COLUMN "password",
ADD COLUMN     "isWaliKelas" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passwordHash" TEXT NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL;

-- DropTable
DROP TABLE "AcademicCalendar";

-- DropTable
DROP TABLE "Announcement";

-- DropTable
DROP TABLE "Attendance";

-- DropTable
DROP TABLE "Bill";

-- DropTable
DROP TABLE "Class";

-- DropTable
DROP TABLE "Grade";

-- DropTable
DROP TABLE "PaymentType";

-- DropTable
DROP TABLE "Report";

-- DropTable
DROP TABLE "Schedule";

-- DropTable
DROP TABLE "Student";

-- DropTable
DROP TABLE "Subject";

-- DropTable
DROP TABLE "Teacher";

-- DropEnum
DROP TYPE "AttendanceStatus";

-- DropEnum
DROP TYPE "BillStatus";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guru" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nip" TEXT,
    "nama" TEXT NOT NULL,
    "email" TEXT,
    "jenisKelamin" TEXT,
    "agama" TEXT,
    "tempatLahir" TEXT,
    "tanggalLahir" TIMESTAMP(3),
    "noTelp" TEXT,
    "nik" TEXT,
    "nuptk" TEXT,
    "statusKepegawaian" TEXT,
    "alamat" TEXT,
    "isAktif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Guru_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Siswa" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nis" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "tanggalLahir" TIMESTAMP(3),
    "alamat" TEXT,

    CONSTRAINT "Siswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SekolahData" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "namaSekolah" TEXT NOT NULL,
    "alamat" TEXT,
    "kepalaSekolah" TEXT,

    CONSTRAINT "SekolahData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TahunAjaran" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "isAktif" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TahunAjaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TingkatanKelas" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "namaTingkat" TEXT NOT NULL,

    CONSTRAINT "TingkatanKelas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ruangan" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "namaRuangan" TEXT NOT NULL,
    "kapasitas" INTEGER,

    CONSTRAINT "Ruangan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kelas" (
    "id" TEXT NOT NULL,
    "namaKelas" TEXT NOT NULL,
    "tingkatanId" TEXT NOT NULL,
    "waliKelasId" TEXT,

    CONSTRAINT "Kelas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenempatanSiswa" (
    "id" TEXT NOT NULL,
    "siswaId" TEXT NOT NULL,
    "kelasId" TEXT NOT NULL,
    "tahunAjaranId" TEXT NOT NULL,

    CONSTRAINT "PenempatanSiswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MataPelajaran" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "namaMapel" TEXT NOT NULL,
    "kategori" "MapelCategory" NOT NULL,

    CONSTRAINT "MataPelajaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenugasanGuru" (
    "id" TEXT NOT NULL,
    "guruId" TEXT NOT NULL,
    "mapelId" TEXT NOT NULL,
    "kelasId" TEXT NOT NULL,

    CONSTRAINT "PenugasanGuru_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkemaPenilaian" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "mapelId" TEXT NOT NULL,

    CONSTRAINT "SkemaPenilaian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NilaiKomponen" (
    "id" TEXT NOT NULL,
    "skemaId" TEXT NOT NULL,
    "namaKomponen" TEXT NOT NULL,
    "tipe" "NilaiKomponenType" NOT NULL,
    "formula" TEXT,
    "urutan" INTEGER NOT NULL,

    CONSTRAINT "NilaiKomponen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jadwal" (
    "id" TEXT NOT NULL,
    "tahunAjaranId" TEXT NOT NULL,
    "kelasId" TEXT NOT NULL,
    "mapelId" TEXT NOT NULL,
    "guruId" TEXT NOT NULL,
    "ruanganId" TEXT NOT NULL,
    "hari" TEXT NOT NULL,
    "waktuMulai" TEXT NOT NULL,
    "waktuSelesai" TEXT NOT NULL,

    CONSTRAINT "Jadwal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AbsensiSesi" (
    "id" TEXT NOT NULL,
    "guruId" TEXT NOT NULL,
    "kelasId" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "pertemuanKe" INTEGER NOT NULL,

    CONSTRAINT "AbsensiSesi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AbsensiDetail" (
    "id" TEXT NOT NULL,
    "siswaId" TEXT NOT NULL,
    "sesiId" TEXT NOT NULL,
    "status" "AbsensiStatus" NOT NULL,

    CONSTRAINT "AbsensiDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NilaiDetailSiswa" (
    "id" TEXT NOT NULL,
    "siswaId" TEXT NOT NULL,
    "mapelId" TEXT NOT NULL,
    "komponenId" TEXT,
    "guruId" TEXT NOT NULL,
    "nilaiAngka" DOUBLE PRECISION,
    "nilaiDeskripsi" TEXT,

    CONSTRAINT "NilaiDetailSiswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CapaianKompetensi" (
    "id" TEXT NOT NULL,
    "siswaId" TEXT NOT NULL,
    "mapelId" TEXT NOT NULL,
    "guruId" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,

    CONSTRAINT "CapaianKompetensi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rapor" (
    "id" TEXT NOT NULL,
    "siswaId" TEXT NOT NULL,
    "kelasId" TEXT NOT NULL,
    "tahunAjaranId" TEXT NOT NULL,
    "waliKelasId" TEXT NOT NULL,
    "catatanWaliKelas" TEXT,
    "dataKokurikuler" TEXT,
    "isFinalisasi" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Rapor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NilaiRaporAkhir" (
    "id" TEXT NOT NULL,
    "raporId" TEXT NOT NULL,
    "mapelId" TEXT NOT NULL,
    "nilaiAkhir" DOUBLE PRECISION,
    "isOverride" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "NilaiRaporAkhir_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dokumen" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "urlFile" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dokumen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pengumuman" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "konten" TEXT NOT NULL,
    "tanggalPublikasi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pengumuman_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_userId_key" ON "Admin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Guru_userId_key" ON "Guru"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Guru_nip_key" ON "Guru"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "Guru_email_key" ON "Guru"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Siswa_userId_key" ON "Siswa"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Siswa_nis_key" ON "Siswa"("nis");

-- CreateIndex
CREATE UNIQUE INDEX "TahunAjaran_nama_key" ON "TahunAjaran"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "TingkatanKelas_namaTingkat_key" ON "TingkatanKelas"("namaTingkat");

-- CreateIndex
CREATE UNIQUE INDEX "Ruangan_namaRuangan_key" ON "Ruangan"("namaRuangan");

-- CreateIndex
CREATE UNIQUE INDEX "Kelas_waliKelasId_key" ON "Kelas"("waliKelasId");

-- CreateIndex
CREATE UNIQUE INDEX "PenempatanSiswa_siswaId_tahunAjaranId_key" ON "PenempatanSiswa"("siswaId", "tahunAjaranId");

-- CreateIndex
CREATE UNIQUE INDEX "PenugasanGuru_guruId_mapelId_kelasId_key" ON "PenugasanGuru"("guruId", "mapelId", "kelasId");

-- CreateIndex
CREATE UNIQUE INDEX "SkemaPenilaian_mapelId_key" ON "SkemaPenilaian"("mapelId");

-- CreateIndex
CREATE UNIQUE INDEX "AbsensiSesi_kelasId_tanggal_pertemuanKe_key" ON "AbsensiSesi"("kelasId", "tanggal", "pertemuanKe");

-- CreateIndex
CREATE UNIQUE INDEX "AbsensiDetail_siswaId_sesiId_key" ON "AbsensiDetail"("siswaId", "sesiId");

-- CreateIndex
CREATE UNIQUE INDEX "NilaiDetailSiswa_siswaId_mapelId_komponenId_key" ON "NilaiDetailSiswa"("siswaId", "mapelId", "komponenId");

-- CreateIndex
CREATE UNIQUE INDEX "CapaianKompetensi_siswaId_mapelId_key" ON "CapaianKompetensi"("siswaId", "mapelId");

-- CreateIndex
CREATE UNIQUE INDEX "Rapor_siswaId_tahunAjaranId_key" ON "Rapor"("siswaId", "tahunAjaranId");

-- CreateIndex
CREATE UNIQUE INDEX "NilaiRaporAkhir_raporId_mapelId_key" ON "NilaiRaporAkhir"("raporId", "mapelId");

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guru" ADD CONSTRAINT "Guru_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Siswa" ADD CONSTRAINT "Siswa_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SekolahData" ADD CONSTRAINT "SekolahData_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TahunAjaran" ADD CONSTRAINT "TahunAjaran_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TingkatanKelas" ADD CONSTRAINT "TingkatanKelas_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruangan" ADD CONSTRAINT "Ruangan_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kelas" ADD CONSTRAINT "Kelas_tingkatanId_fkey" FOREIGN KEY ("tingkatanId") REFERENCES "TingkatanKelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kelas" ADD CONSTRAINT "Kelas_waliKelasId_fkey" FOREIGN KEY ("waliKelasId") REFERENCES "Guru"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenempatanSiswa" ADD CONSTRAINT "PenempatanSiswa_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES "Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenempatanSiswa" ADD CONSTRAINT "PenempatanSiswa_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES "Kelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenempatanSiswa" ADD CONSTRAINT "PenempatanSiswa_tahunAjaranId_fkey" FOREIGN KEY ("tahunAjaranId") REFERENCES "TahunAjaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MataPelajaran" ADD CONSTRAINT "MataPelajaran_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenugasanGuru" ADD CONSTRAINT "PenugasanGuru_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenugasanGuru" ADD CONSTRAINT "PenugasanGuru_mapelId_fkey" FOREIGN KEY ("mapelId") REFERENCES "MataPelajaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenugasanGuru" ADD CONSTRAINT "PenugasanGuru_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES "Kelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkemaPenilaian" ADD CONSTRAINT "SkemaPenilaian_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkemaPenilaian" ADD CONSTRAINT "SkemaPenilaian_mapelId_fkey" FOREIGN KEY ("mapelId") REFERENCES "MataPelajaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NilaiKomponen" ADD CONSTRAINT "NilaiKomponen_skemaId_fkey" FOREIGN KEY ("skemaId") REFERENCES "SkemaPenilaian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jadwal" ADD CONSTRAINT "Jadwal_tahunAjaranId_fkey" FOREIGN KEY ("tahunAjaranId") REFERENCES "TahunAjaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jadwal" ADD CONSTRAINT "Jadwal_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES "Kelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jadwal" ADD CONSTRAINT "Jadwal_mapelId_fkey" FOREIGN KEY ("mapelId") REFERENCES "MataPelajaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jadwal" ADD CONSTRAINT "Jadwal_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jadwal" ADD CONSTRAINT "Jadwal_ruanganId_fkey" FOREIGN KEY ("ruanganId") REFERENCES "Ruangan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbsensiSesi" ADD CONSTRAINT "AbsensiSesi_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbsensiSesi" ADD CONSTRAINT "AbsensiSesi_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES "Kelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbsensiDetail" ADD CONSTRAINT "AbsensiDetail_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES "Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbsensiDetail" ADD CONSTRAINT "AbsensiDetail_sesiId_fkey" FOREIGN KEY ("sesiId") REFERENCES "AbsensiSesi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NilaiDetailSiswa" ADD CONSTRAINT "NilaiDetailSiswa_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES "Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NilaiDetailSiswa" ADD CONSTRAINT "NilaiDetailSiswa_mapelId_fkey" FOREIGN KEY ("mapelId") REFERENCES "MataPelajaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NilaiDetailSiswa" ADD CONSTRAINT "NilaiDetailSiswa_komponenId_fkey" FOREIGN KEY ("komponenId") REFERENCES "NilaiKomponen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NilaiDetailSiswa" ADD CONSTRAINT "NilaiDetailSiswa_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapaianKompetensi" ADD CONSTRAINT "CapaianKompetensi_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES "Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapaianKompetensi" ADD CONSTRAINT "CapaianKompetensi_mapelId_fkey" FOREIGN KEY ("mapelId") REFERENCES "MataPelajaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapaianKompetensi" ADD CONSTRAINT "CapaianKompetensi_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rapor" ADD CONSTRAINT "Rapor_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES "Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rapor" ADD CONSTRAINT "Rapor_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES "Kelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rapor" ADD CONSTRAINT "Rapor_tahunAjaranId_fkey" FOREIGN KEY ("tahunAjaranId") REFERENCES "TahunAjaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rapor" ADD CONSTRAINT "Rapor_waliKelasId_fkey" FOREIGN KEY ("waliKelasId") REFERENCES "Guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NilaiRaporAkhir" ADD CONSTRAINT "NilaiRaporAkhir_raporId_fkey" FOREIGN KEY ("raporId") REFERENCES "Rapor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NilaiRaporAkhir" ADD CONSTRAINT "NilaiRaporAkhir_mapelId_fkey" FOREIGN KEY ("mapelId") REFERENCES "MataPelajaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dokumen" ADD CONSTRAINT "Dokumen_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pengumuman" ADD CONSTRAINT "Pengumuman_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
