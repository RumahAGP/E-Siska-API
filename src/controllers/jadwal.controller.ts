import { Request, Response, NextFunction } from "express";
import { createJadwalService } from "../service/jadwal.service";
import logger from "../utils/logger";

class JadwalController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;

      const result = await createJadwalService({
        tahunAjaranId: data.tahunAjaranId,
        kelasId: data.kelasId,
        mapelId: data.mapelId,
        guruId: data.guruId,
        ruanganId: data.ruanganId,
        hari: data.hari,
        waktuMulai: data.waktuMulai,
        waktuSelesai: data.waktuSelesai,
      });

      res.status(201).send({
        success: true,
        message: "Jadwal berhasil dibuat",
        data: result,
      }); 
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error create jadwal: ${error.message}`);
      }
      next(error);
    }
  }
}

export default JadwalController;