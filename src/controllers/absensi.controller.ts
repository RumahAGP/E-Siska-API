import { Request, Response, NextFunction } from "express";
import {
  createSesiService,
  getSesiByKelasService,
  getSesiDetailService,
} from "../service/absensi.service";
import logger from "../utils/logger";

class AbsensiController {
  public async createSesi(req: Request, res: Response, next: NextFunction) {
    try {
      const { guruId, kelasId, tanggal, pertemuanKe } = req.body;

      const result = await createSesiService({
        guruId,
        kelasId,
        tanggal,
        pertemuanKe,
      });

      res.status(201).send({
        success: true,
        message: "Sesi absensi berhasil dibuat",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error create sesi absensi: ${error.message}`);
      }
      next(error);
    }
  }

  public async getSesiByKelas(req: Request, res: Response, next: NextFunction) {
    try {
      const { kelasId } = req.params;

      const result = await getSesiByKelasService(kelasId);

      res.status(200).send({
        success: true,
        message: "Daftar sesi berhasil diambil",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get sesi by kelas: ${error.message}`);
      }
      next(error);
    }
  }

  public async getSesiDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { sesiId } = req.params;

      const result = await getSesiDetailService(sesiId);

      res.status(200).send({
        success: true,
        message: "Detail sesi berhasil diambil",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get sesi detail: ${error.message}`);
      }
      next(error);
    }
  }
}

export default AbsensiController;
