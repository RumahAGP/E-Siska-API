import { Request, Response, NextFunction } from "express";
import {
  createBackupService,
  listBackupsService,
  restoreBackupService,
  deleteBackupService,
} from "../service/backup.service";
import logger from "../utils/logger";

class BackupController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Admin requesting database backup');

      const result = await createBackupService();

      res.status(200).send({
        success: true,
        ...result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error creating backup: ${error.message}`);
      }
      next(error);
    }
  }

  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await listBackupsService();

      res.status(200).send({
        success: true,
        message: "Daftar backup berhasil diambil",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error listing backups: ${error.message}`);
      }
      next(error);
    }
  }

  public async restore(req: Request, res: Response, next: NextFunction) {
    try {
      const { filename } = req.body;

      if (!filename) {
        return res.status(400).send({
          success: false,
          message: "Filename harus disertakan",
        });
      }

      logger.warn(`Admin requesting database restore from: ${filename}`);

      const result = await restoreBackupService(filename);

      res.status(200).send({
        success: true,
        ...result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error restoring backup: ${error.message}`);
      }
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { filename } = req.params;

      const result = await deleteBackupService(filename);

      res.status(200).send({
        success: true,
        ...result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error deleting backup: ${error.message}`);
      }
      next(error);
    }
  }
}

export default BackupController;
