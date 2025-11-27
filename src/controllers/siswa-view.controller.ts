import { Request, Response, NextFunction } from "express";
import {
  getMyAbsensiService,
  getMyNilaiService,
  getMyJadwalService,
  getPengumumanService,
  getDokumenService,
} from "../service/siswa-view.service";
import logger from "../utils/logger";

class SiswaViewController {
  public async getMyAbsensi(req: Request, res: Response, next: NextFunction) {
    try {
      const siswaId = req.user?.siswaId;
      const tahunAjaranId = req.query.tahunAjaranId as string | undefined;

      if (!siswaId) {
        return res.status(403).send({
          success: false,
          message: "Siswa ID tidak ditemukan",
        });
      }

      logger.info(`Siswa ${siswaId} fetching own attendance`);

      const result = await getMyAbsensiService(siswaId, tahunAjaranId);

      res.status(200).send({
        success: true,
        message: "Data absensi berhasil diambil",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get my absensi: ${error.message}`);
      }
      next(error);
    }
  }

  public async getMyNilai(req: Request, res: Response, next: NextFunction) {
    try {
      const siswaId = req.user?.siswaId;
      const tahunAjaranId = req.query.tahunAjaranId as string | undefined;

      if (!siswaId) {
        return res.status(403).send({
          success: false,
          message: "Siswa ID tidak ditemukan",
        });
      }

      logger.info(`Siswa ${siswaId} fetching own grades`);

      const result = await getMyNilaiService(siswaId, tahunAjaranId);

      res.status(200).send({
        success: true,
        message: "Data nilai berhasil diambil",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get my nilai: ${error.message}`);
      }
      next(error);
    }
  }

  public async getMyJadwal(req: Request, res: Response, next: NextFunction) {
    try {
      const siswaId = req.user?.siswaId;

      if (!siswaId) {
        return res.status(403).send({
          success: false,
          message: "Siswa ID tidak ditemukan",
        });
      }

      logger.info(`Siswa ${siswaId} fetching class schedule`);

      const result = await getMyJadwalService(siswaId);

      res.status(200).send({
        success: true,
        message: "Jadwal pelajaran berhasil diambil",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get my jadwal: ${error.message}`);
      }
      next(error);
    }
  }

  public async getPengumuman(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info("Fetching pengumuman for siswa");

      const result = await getPengumumanService();

      res.status(200).send({
        success: true,
        message: "Pengumuman berhasil diambil",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get pengumuman: ${error.message}`);
      }
      next(error);
    }
  }

  public async getDokumen(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info("Fetching dokumen for siswa");

      const result = await getDokumenService();

      res.status(200).send({
        success: true,
        message: "Daftar dokumen berhasil diambil",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get dokumen: ${error.message}`);
      }
      next(error);
    }
  }
}

export default SiswaViewController;
