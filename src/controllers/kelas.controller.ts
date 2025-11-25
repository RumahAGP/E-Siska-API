import { Request, Response, NextFunction } from "express";
import { createKelasService, updateKelasService, deleteKelasService, getAllKelasService, getMyClassService } from "../service/kelas.service";
import logger from "../utils/logger";

class KelasController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { namaKelas, tingkatanId, waliKelasId } = req.body;

      const result = await createKelasService({
        namaKelas,
        tingkatanId,
        waliKelasId,
      });

      res.status(201).send({
        success: true,
        message: "Kelas berhasil dibuat",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error create kelas: ${error.message}`);
      }
      next(error);
    }
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getAllKelasService();

      res.status(200).send({
        success: true,
        message: "Data kelas berhasil diambil",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get all kelas: ${error.message}`);
      }
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { namaKelas, tingkatanId, waliKelasId } = req.body;

      const result = await updateKelasService(id, {
        namaKelas,
        tingkatanId,
        waliKelasId,
      });

      res.status(200).send({
        success: true,
        message: "Kelas berhasil diperbarui",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error update kelas: ${error.message}`);
      }
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await deleteKelasService(id);

      res.status(200).send({
        success: true,
        message: "Kelas berhasil dihapus",
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error delete kelas: ${error.message}`);
      }
      next(error);
    }
  }

  public async getMyClass(req: Request, res: Response, next: NextFunction) {
    try {
      // Asumsi: user sudah diautentikasi dan guruId ada di req.user
      // Namun karena tipe req.user belum strict di sini, kita ambil dari req.user.id
      // Pastikan middleware auth sudah memasang user ke req
      const guruId = (req as any).user?.id; 

      if (!guruId) {
        throw new Error("User ID not found in request");
      }

      const result = await getMyClassService(guruId);

      res.status(200).send({
        success: true,
        message: "Data kelas wali kelas berhasil diambil",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get my class: ${error.message}`);
      }
      next(error);
    }
  }
}

export default KelasController;
