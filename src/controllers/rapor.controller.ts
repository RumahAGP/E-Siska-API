import { Request, Response, NextFunction } from "express";
import { inputDataRaporService } from "../service/rapor.service";
import logger from "../utils/logger";

class RaporController {
  public async updateDataRapor(req: Request, res: Response, next: NextFunction) {
    try {
      const { siswaId } = req.params;
      const { guruId, tahunAjaranId, catatan, kokurikuler } = req.body;

      const result = await inputDataRaporService({
        guruId,
        siswaId,
        tahunAjaranId,
        catatan,
        kokurikuler,
      });

      res.status(200).send({
        success: true,
        message: "Data rapor berhasil diperbarui",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error update rapor: ${error.message}`);
      }
      next(error);
    }
  }
}

export default RaporController;