import { Request, Response, NextFunction } from "express";
import { createGuruService } from "../service/guru.service";
import logger from "../utils/logger";

class GuruController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      // Data diambil dari body setelah lolos validasi
      const dataGuru = req.body;

      logger.info(`Mencoba membuat guru baru dengan NIP: ${dataGuru.nip}`);

      const result = await createGuruService(dataGuru);

      res.status(201).send({
        success: true,
        message: "Guru dan Akun berhasil dibuat",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error create guru: ${error.message}`);
      }
      next(error); // Lempar ke error handler di app.ts
    }
  }

  // (Nanti kita tambahkan method lain: get, update, delete)
}

export default GuruController;