import { Request, Response, NextFunction } from "express";
import {
  createPenempatanService,
  getAllPenempatanService,
  getPenempatanByIdService,
  updatePenempatanService,
  deletePenempatanService,
} from "../service/penempatan.service";
import logger from "../utils/logger";

class PenempatanController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { siswaId, kelasId, tahunAjaranId } = req.body;

      const result = await createPenempatanService({
        siswaId,
        kelasId,
        tahunAjaranId,
      });

      res.status(201).send({
        success: true,
        message: "Penempatan siswa berhasil dibuat",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error create penempatan: ${error.message}`);
      }
      next(error);
    }
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { tahunAjaranId, kelasId, siswaId } = req.query;

      const result = await getAllPenempatanService({
        tahunAjaranId: tahunAjaranId as string,
        kelasId: kelasId as string,
        siswaId: siswaId as string,
      });

      res.status(200).send({
        success: true,
        message: "Daftar penempatan berhasil diambil",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error get all penempatan: ${error.message}`);
      }
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await getPenempatanByIdService(id);

      res.status(200).send({
        success: true,
        message: "Penempatan berhasil diambil",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error get penempatan by id: ${error.message}`);
      }
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;

      const result = await updatePenempatanService(id, data);

      res.status(200).send({
        success: true,
        message: "Penempatan berhasil diupdate",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error update penempatan: ${error.message}`);
      }
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await deletePenempatanService(id);

      res.status(200).send({
        success: true,
        ...result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error delete penempatan: ${error.message}`);
      }
      next(error);
    }
  }
}

export default PenempatanController;
