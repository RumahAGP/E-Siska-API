import { Request, Response, NextFunction } from "express";
import {
  createPengumumanService,
  getAllPengumumanService,
  getPengumumanByIdService,
  updatePengumumanService,
  deletePengumumanService,
} from "../service/pengumuman.service";
import logger from "../utils/logger";

class PengumumanController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { judul, konten } = req.body;
      const { id: userId } = req.user as any;

      if (!userId) {
        throw new Error("User ID not found");
      }

      const result = await createPengumumanService({
        judul,
        konten,
        adminId: userId,
      });

      res.status(201).send({
        success: true,
        message: "Pengumuman berhasil dibuat",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error create pengumuman: ${error.message}`);
      }
      next(error);
    }
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      const result = await getAllPengumumanService(page, limit);

      res.status(200).send({
        success: true,
        message: "Daftar pengumuman berhasil diambil",
        ...result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error get all pengumuman: ${error.message}`);
      }
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await getPengumumanByIdService(id);

      res.status(200).send({
        success: true,
        message: "Pengumuman berhasil diambil",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error get pengumuman by id: ${error.message}`);
      }
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { judul, konten } = req.body;

      const result = await updatePengumumanService(id, { judul, konten });

      res.status(200).send({
        success: true,
        message: "Pengumuman berhasil diupdate",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error update pengumuman: ${error.message}`);
      }
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await deletePengumumanService(id);

      res.status(200).send({
        success: true,
        ...result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error delete pengumuman: ${error.message}`);
      }
      next(error);
    }
  }
}

export default PengumumanController;
