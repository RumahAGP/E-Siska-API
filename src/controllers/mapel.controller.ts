import { Request, Response, NextFunction } from "express";
import { createMapelService, updateMapelService, deleteMapelService, getAllMapelService } from "../service/mapel.service";
import logger from "../utils/logger";

class MapelController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { namaMapel, kategori } = req.body;

      const result = await createMapelService({
        namaMapel,
        kategori,
      });

      res.status(201).send({
        success: true,
        message: "Mata pelajaran dan skema (kosong) berhasil dibuat",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error create mapel: ${error.message}`);
      }
      next(error);
    }
  }
  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { namaMapel, kategori } = req.body;

      const result = await updateMapelService(id, {
        namaMapel,
        kategori,
      });

      res.status(200).send({
        success: true,
        message: "Mata pelajaran berhasil diperbarui",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error update mapel: ${error.message}`);
      }
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await deleteMapelService(id);

      res.status(200).send({
        success: true,
        message: "Mata pelajaran berhasil dihapus",
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error delete mapel: ${error.message}`);
      }
      next(error);
    }
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getAllMapelService();

      res.status(200).send({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default MapelController;
