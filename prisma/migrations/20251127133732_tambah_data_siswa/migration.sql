/*
  Warnings:

  - A unique constraint covering the columns `[nisn]` on the table `Siswa` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Siswa" ADD COLUMN     "agama" TEXT,
ADD COLUMN     "alamatOrtu" TEXT,
ADD COLUMN     "alamatWali" TEXT,
ADD COLUMN     "jenisKelamin" TEXT,
ADD COLUMN     "namaAyah" TEXT,
ADD COLUMN     "namaIbu" TEXT,
ADD COLUMN     "namaWali" TEXT,
ADD COLUMN     "nik" TEXT,
ADD COLUMN     "nisn" TEXT,
ADD COLUMN     "pekerjaanAyah" TEXT,
ADD COLUMN     "pekerjaanIbu" TEXT,
ADD COLUMN     "pekerjaanWali" TEXT,
ADD COLUMN     "pendidikanSebelumnya" TEXT,
ADD COLUMN     "status" TEXT DEFAULT 'Aktif',
ADD COLUMN     "tempatLahir" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Siswa_nisn_key" ON "Siswa"("nisn");
