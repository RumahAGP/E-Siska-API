import { Request, Response, NextFunction } from "express";
import {
  getMyJadwalGuruService,
  getPengumumanGuruService,
  getDokumenGuruService,
} from "../service/guru-view.service";
import logger from "../utils/logger";

class GuruViewController {
  public async getMyJadwal(req: Request, res: Response, next: NextFunction) {
    try {
      const guruId = req.user?.guruId;

      if (!guruId) {
        return res.status(403).send({
          success: false,
          message: "Guru ID tidak ditemukan",
        });
      }

      logger.info(`Guru ${guruId} fetching own schedule`);

      const result = await getMyJadwalGuruService(guruId);

      res.status(200).send({
        success: true,
        message: "Jadwal mengajar berhasil diambil",
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
      logger.info('Guru fetching pengumuman');

      const result = await getPengumumanGuruService();

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
      logger.info('Guru fetching dokumen');

      const result = await getDokumenGuruService();

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

export default GuruViewController;
