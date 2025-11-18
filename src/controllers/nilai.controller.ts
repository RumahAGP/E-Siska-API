import { Request, Response, NextFunction } from "express";
import { inputNilaiService } from "../service/nilai.service";
import logger from "../utils/logger";

class NilaiController {
  public async inputNilai(req: Request, res: Response, next: NextFunction) {
    try {
      const { guruId, mapelId, komponenId, data } = req.body;

      const result = await inputNilaiService({
        guruId,
        mapelId,
        komponenId,
        data,
      });

      res.status(200).send({
        success: true,
        message: "Nilai berhasil disimpan",
        totalData: result.length,
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error input nilai: ${error.message}`);
      }
      next(error);
    }
  }
}

export default NilaiController;