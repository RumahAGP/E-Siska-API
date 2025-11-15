import { Request, Response, NextFunction } from "express";
import { createDokumenService } from "../service/dokumen.service";
import logger from "../utils/logger";
import AppError from "../utils/AppError";

class DokumenController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { judul } = req.body;

      // 1. Cek apakah file diupload
      if (!req.file) {
        throw new AppError("File dokumen wajib diupload", 400);
      }

      // 2. Panggil service
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
}

export default DokumenController;