import { Request, Response, NextFunction } from "express";
import {
  createSiswaService,
  getAllSiswaService,
  getSiswaByIdService,
  updateSiswaService,
  deleteSiswaService,
} from "../service/siswa.service";
import logger from "../utils/logger";

class SiswaController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dataSiswa = req.body;

      logger.info(`Mencoba membuat siswa baru dengan NIS: ${dataSiswa.nis}`);

      const result = await createSiswaService(dataSiswa);

      res.status(201).send({
        success: true,
        message: "Siswa dan Akun berhasil dibuat",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error create siswa: ${error.message}`);
      }
      next(error);
    }
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      logger.info(`Fetching all siswa - Page: ${page}, Limit: ${limit}`);

      const result = await getAllSiswaService(page, limit);

      res.status(200).send({
        success: true,
        message: "Data siswa berhasil diambil",
        ...result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get all siswa: ${error.message}`);
      }
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      logger.info(`Fetching siswa by ID: ${id}`);

      const result = await getSiswaByIdService(id);

      res.status(200).send({
        success: true,
        message: "Data siswa berhasil diambil",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get siswa by ID: ${error.message}`);
      }
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      logger.info(`Updating siswa: ${id}`);

      const result = await updateSiswaService(id, updateData);

      res.status(200).send({
        success: true,
        message: "Data siswa berhasil diupdate",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error update siswa: ${error.message}`);
      }
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      logger.info(`Deleting siswa: ${id}`);

      const result = await deleteSiswaService(id);

      res.status(200).send({
        success: true,
        ...result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error delete siswa: ${error.message}`);
      }
      next(error);
    }
  }
}

export default SiswaController;
