import { Request, Response, NextFunction } from "express";
import { addKomponenToSkemaService } from "../service/skema.service";
import logger from "../utils/logger";

class SkemaController {
  public async addKomponen(req: Request, res: Response, next: NextFunction) {
    try {
      const { skemaId } = req.params; // Ambil dari URL
      const { namaKomponen, tipe, formula, urutan } = req.body;

      const result = await addKomponenToSkemaService({
        skemaId,
        namaKomponen,
        tipe,
        formula,
        urutan,
      });

      res.status(201).send({
        success: true,
        message: "Komponen nilai berhasil ditambahkan ke skema",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(
          `Error add komponen ke skema ${req.params.skemaId}: ${error.message}`,
        );
      }
      next(error);
    }
  }

  // (Nanti bisa ditambah method getSkemaDetail, updateKomponen, dll)
}

export default SkemaController;