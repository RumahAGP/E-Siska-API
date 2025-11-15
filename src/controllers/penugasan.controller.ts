import { Request, Response, NextFunction } from "express";
import { createPenugasanService } from "../service/penugasan.service";
import logger from "../utils/logger";

class PenugasanController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { guruId, mapelId, kelasId } = req.body;

      const result = await createPenugasanService({
        guruId,
        mapelId,
        kelasId,
      });

      res.status(201).send({
        success: true,
        message: "Penugasan guru berhasil dibuat",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error create penugasan: ${error.message}`);
      }
      next(error);
    }
  }
}

export default PenugasanController;