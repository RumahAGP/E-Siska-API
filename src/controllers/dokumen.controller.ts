import { Request, Response, NextFunction } from "express";
import {
  createDokumenService,
  getAllDokumenService,
  deleteDokumenService,
} from "../service/dokumen.service";
import logger from "../utils/logger";
import AppError from "../utils/AppError";

class DokumenController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { judul } = req.body;

      if (!req.file) {
        throw new AppError("File dokumen wajib diupload", 400);
      }

      const result = await createDokumenService({
        judul,
        file: req.file,
      });

      res.status(201).send({
        success: true,
        message: "Dokumen berhasil diupload",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error create dokumen: ${error.message}`);
      }
      next(error);
    }
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      const result = await getAllDokumenService(page, limit);

      res.status(200).send({
        success: true,
        message: "Daftar dokumen berhasil diambil",
        ...result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error get all dokumen: ${error.message}`);
      }
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await deleteDokumenService(id);

      res.status(200).send({
        success: true,
        ...result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error delete dokumen: ${error.message}`);
      }
      next(error);
    }
  }
}

export default DokumenController;
