import { Request, Response, NextFunction } from "express";
import {
  createGuruService,
  getAllGuruService,
  getGuruByIdService,
  updateGuruService,
  deleteGuruService,
} from "../service/guru.service";
import logger from "../utils/logger";

class GuruController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dataGuru = req.body;

      logger.info(`Mencoba membuat guru baru dengan NIP: ${dataGuru.nip}`);

      const result = await createGuruService(dataGuru);

      res.status(201).send({
        success: true,
        message: "Guru dan Akun berhasil dibuat",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error create guru: ${error.message}`);
      }
      next(error);
    }
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      logger.info(`Fetching all guru - Page: ${page}, Limit: ${limit}`);

      const result = await getAllGuruService(page, limit);

      res.status(200).send({
        success: true,
        message: "Data guru berhasil diambil",
        ...result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get all guru: ${error.message}`);
      }
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      logger.info(`Fetching guru by ID: ${id}`);

      const result = await getGuruByIdService(id);

      res.status(200).send({
        success: true,
        message: "Data guru berhasil diambil",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get guru by ID: ${error.message}`);
      }
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      logger.info(`Updating guru: ${id}`);

      const result = await updateGuruService(id, updateData);

      res.status(200).send({
        success: true,
        message: "Data guru berhasil diupdate",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error update guru: ${error.message}`);
      }
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      logger.info(`Deleting guru: ${id}`);

      const result = await deleteGuruService(id);

      res.status(200).send({
        success: true,
        ...result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error delete guru: ${error.message}`);
      }
      next(error);
    }
  }
}

export default GuruController;
