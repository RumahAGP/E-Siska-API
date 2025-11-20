import { Request, Response, NextFunction } from "express";
import {
  createTahunAjaranService,
  getAllTahunAjaranService,
  getTahunAjaranByIdService,
  updateTahunAjaranService,
  activateTahunAjaranService,
  deleteTahunAjaranService,
} from "../service/tahunAjaran.service";
import logger from "../utils/logger";

class TahunAjaranController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { nama } = req.body;

      const result = await createTahunAjaranService({ nama });

      res.status(201).send({
        success: true,
        message: "Tahun ajaran berhasil dibuat",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error create tahun ajaran: ${error.message}`);
      }
      next(error);
    }
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getAllTahunAjaranService();

      res.status(200).send({
        success: true,
        message: "Daftar tahun ajaran berhasil diambil",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error get all tahun ajaran: ${error.message}`);
      }
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await getTahunAjaranByIdService(id);

      res.status(200).send({
        success: true,
        message: "Tahun ajaran berhasil diambil",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error get tahun ajaran by id: ${error.message}`);
      }
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { nama } = req.body;

      const result = await updateTahunAjaranService(id, { nama });

      res.status(200).send({
        success: true,
        message: "Tahun ajaran berhasil diupdate",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error update tahun ajaran: ${error.message}`);
      }
      next(error);
    }
  }

  public async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await activateTahunAjaranService(id);

      res.status(200).send({
        success: true,
        message: "Tahun ajaran berhasil diaktifkan",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error activate tahun ajaran: ${error.message}`);
      }
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await deleteTahunAjaranService(id);

      res.status(200).send({
        success: true,
        ...result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error delete tahun ajaran: ${error.message}`);
      }
      next(error);
    }
  }
}

export default TahunAjaranController;