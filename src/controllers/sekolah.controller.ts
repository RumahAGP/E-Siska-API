import { Request, Response, NextFunction } from "express";
import {
  getSekolahDataService,
  upsertSekolahDataService,
  deleteSekolahDataService,
} from "../service/sekolah.service";
import logger from "../utils/logger";

class SekolahController {
  public async get(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getSekolahDataService();

      res.status(200).send({
        success: true,
        message: "Data sekolah berhasil diambil",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error get sekolah data: ${error.message}`);
      }
      next(error);
    }
  }

  public async upsert(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = req.user?.adminId;

      if (!adminId) {
        return res.status(403).send({
          success: false,
          message: "Admin ID tidak ditemukan",
        });
      }

      const { namaSekolah, alamat, kepalaSekolah } = req.body;

      const result = await upsertSekolahDataService(
        {
          namaSekolah,
          alamat,
          kepalaSekolah,
        },
        adminId
      );

      res.status(200).send({
        success: true,
        message: "Data sekolah berhasil disimpan",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error upsert sekolah data: ${error.message}`);
      }
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await deleteSekolahDataService();

      res.status(200).send({
        success: true,
        ...result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error delete sekolah data: ${error.message}`);
      }
      next(error);
    }
  }
}

export default SekolahController;
