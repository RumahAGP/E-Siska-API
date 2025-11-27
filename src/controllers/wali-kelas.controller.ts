import { Request, Response, NextFunction } from "express";
import {
  getRekapNilaiKelasService,
  getRekapAbsensiKelasService,
  getDataSiswaBimbinganService,
  getMyKelasService,
} from "../service/wali-kelas.service";
import logger from "../utils/logger";

class WaliKelasController {
  public async getRekapNilai(req: Request, res: Response, next: NextFunction) {
    try {
      const guruId = req.user?.guruId;
      const { kelasId } = req.params;

      if (!guruId) {
        return res.status(403).send({
          success: false,
          message: "Guru ID tidak ditemukan",
        });
      }

      logger.info(
        `Wali kelas ${guruId} fetching rekap nilai for kelas ${kelasId}`
      );

      const result = await getRekapNilaiKelasService(guruId, kelasId);

      res.status(200).send({
        success: true,
        message: "Rekap nilai kelas berhasil diambil",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get rekap nilai: ${error.message}`);
      }
      next(error);
    }
  }

  public async getRekapAbsensi(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const guruId = req.user?.guruId;
      const { kelasId } = req.params;

      if (!guruId) {
        return res.status(403).send({
          success: false,
          message: "Guru ID tidak ditemukan",
        });
      }

      logger.info(
        `Wali kelas ${guruId} fetching rekap absensi for kelas ${kelasId}`
      );

      const result = await getRekapAbsensiKelasService(guruId, kelasId);

      res.status(200).send({
        success: true,
        message: "Rekap absensi kelas berhasil diambil",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get rekap absensi: ${error.message}`);
      }
      next(error);
    }
  }

  public async getDataSiswa(req: Request, res: Response, next: NextFunction) {
    try {
      const guruId = req.user?.guruId;
      const { kelasId } = req.params;

      if (!guruId) {
        return res.status(403).send({
          success: false,
          message: "Guru ID tidak ditemukan",
        });
      }

      logger.info(
        `Wali kelas ${guruId} fetching data siswa for kelas ${kelasId}`
      );

      const result = await getDataSiswaBimbinganService(guruId, kelasId);

      res.status(200).send({
        success: true,
        message: "Data siswa berhasil diambil",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get data siswa: ${error.message}`);
      }
      next(error);
    }
  }

  public async getMyKelas(req: Request, res: Response, next: NextFunction) {
    try {
      const guruId = req.user?.guruId;

      if (!guruId) {
        return res.status(403).send({
          success: false,
          message: "Guru ID tidak ditemukan",
        });
      }

      logger.info(`Wali kelas ${guruId} fetching own kelas`);

      const result = await getMyKelasService(guruId);

      res.status(200).send({
        success: true,
        message: "Data kelas berhasil diambil",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get my kelas: ${error.message}`);
      }
      next(error);
    }
  }
}

export default WaliKelasController;
