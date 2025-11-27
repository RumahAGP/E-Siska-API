import { Request, Response, NextFunction } from "express";
import {
  createTingkatanService,
  getAllTingkatanService,
  updateTingkatanService,
  deleteTingkatanService,
} from "../service/tingkatan.service";
import logger from "../utils/logger";

class TingkatanController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { namaTingkat } = req.body;

      const result = await createTingkatanService(namaTingkat);

      res.status(201).send({
        success: true,
        message: "Tingkatan kelas berhasil dibuat",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error create tingkatan: ${error.message}`);
      }
      next(error);
    }
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getAllTingkatanService();

      res.status(200).send({
        success: true,
        message: "Daftar tingkatan berhasil diambil",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get all tingkatan: ${error.message}`);
      }
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { namaTingkat } = req.body;

      const result = await updateTingkatanService(id, namaTingkat);

      res.status(200).send({
        success: true,
        message: "Tingkatan berhasil diupdate",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error update tingkatan: ${error.message}`);
      }
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await deleteTingkatanService(id);

      res.status(200).send({
        success: true,
        ...result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error delete tingkatan: ${error.message}`);
      }
      next(error);
    }
  }
}

export default TingkatanController;
