import { Request, Response, NextFunction } from "express";
import { createRuanganService, updateRuanganService, deleteRuanganService, getAllRuanganService } from "../service/ruangan.service";
import logger from "../utils/logger";

class RuanganController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { namaRuangan, kapasitas } = req.body;
      const adminId = req.user?.adminId;

      if (!adminId) {
        throw new Error("Admin ID not found in token");
      }

      const result = await createRuanganService({
        namaRuangan,
        kapasitas,
        adminId,
      });

      res.status(201).send({
        success: true,
        message: "Ruangan berhasil dibuat",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error create ruangan: ${error.message}`);
      }
      next(error);
    }
  }
  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { namaRuangan, kapasitas } = req.body;

      const result = await updateRuanganService(id, {
        namaRuangan,
        kapasitas,
      });

      res.status(200).send({
        success: true,
        message: "Ruangan berhasil diperbarui",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error update ruangan: ${error.message}`);
      }
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await deleteRuanganService(id);

      res.status(200).send({
        success: true,
        message: "Ruangan berhasil dihapus",
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error delete ruangan: ${error.message}`);
      }
      next(error);
    }
  }
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getAllRuanganService();

      res.status(200).send({
        success: true,
        message: "Berhasil mengambil data ruangan",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get all ruangan: ${error.message}`);
      }
      next(error);
    }
  }
}

export default RuanganController;