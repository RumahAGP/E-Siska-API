import { Request, Response, NextFunction } from "express";
import {
  createPenugasanService,
  getAllPenugasanService,
  getPenugasanByIdService,
  updatePenugasanService,
  deletePenugasanService,
} from "../service/penugasan.service";
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

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { guruId, mapelId, kelasId } = req.query;

      const result = await getAllPenugasanService({
        guruId: guruId as string,
        mapelId: mapelId as string,
        kelasId: kelasId as string,
      });

      res.status(200).send({
        success: true,
        message: "Daftar penugasan berhasil diambil",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error get all penugasan: ${error.message}`);
      }
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await getPenugasanByIdService(id);

      res.status(200).send({
        success: true,
        message: "Penugasan berhasil diambil",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error get penugasan by id: ${error.message}`);
      }
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;

      const result = await updatePenugasanService(id, data);

      res.status(200).send({
        success: true,
        message: "Penugasan berhasil diupdate",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error update penugasan: ${error.message}`);
      }
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await deletePenugasanService(id);

      res.status(200).send({
        success: true,
        ...result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error delete penugasan: ${error.message}`);
      }
      next(error);
    }
  }
}

export default PenugasanController;
