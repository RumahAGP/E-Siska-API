import { Request, Response, NextFunction } from "express";
import {
  createJadwalService,
  getAllJadwalService,
  getJadwalByIdService,
  updateJadwalService,
  deleteJadwalService,
} from "../service/jadwal.service";
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

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { tahunAjaranId, kelasId, guruId } = req.query;

      const result = await getAllJadwalService({
        tahunAjaranId: tahunAjaranId as string,
        kelasId: kelasId as string,
        guruId: guruId as string,
      });

      res.status(200).send({
        success: true,
        message: "Daftar jadwal berhasil diambil",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error get all jadwal: ${error.message}`);
      }
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await getJadwalByIdService(id);

      res.status(200).send({
        success: true,
        message: "Jadwal berhasil diambil",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error get jadwal by id: ${error.message}`);
      }
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;

      const result = await updateJadwalService(id, data);

      res.status(200).send({
        success: true,
        message: "Jadwal berhasil diupdate",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error update jadwal: ${error.message}`);
      }
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await deleteJadwalService(id);

      res.status(200).send({
        success: true,
        ...result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error delete jadwal: ${error.message}`);
      }
      next(error);
    }
  }
}

export default JadwalController;
