import { Request, Response, NextFunction } from "express";
import { inputAbsensiService } from "../service/absensiDetail.service";
import logger from "../utils/logger";

class AbsensiDetailController {
  public async inputAbsensi(req: Request, res: Response, next: NextFunction) {
    try {
      const { sesiId } = req.params;
      const { data } = req.body;

      const result = await inputAbsensiService({
        sesiId,
        data,
      });

      res.status(200).send({
        success: true,
        message: "Detail absensi berhasil disimpan",
        totalData: result.length,
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error input absensi: ${error.message}`);
      }
      next(error);
    }
  }
}

export default AbsensiDetailController;