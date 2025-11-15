import { Request, Response, NextFunction } from "express";
import { createRuanganService } from "../service/ruangan.service";
import logger from "../utils/logger";

class RuanganController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { namaRuangan, kapasitas } = req.body;

      const result = await createRuanganService({
        namaRuangan,
        kapasitas,
      });

      res.status(201).send({
        success: true,
        message: "Ruangan berhasil dibuat",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error create ruangan: ${error.message}`);
      }
      next(error);
    }
  }
}

export default RuanganController;