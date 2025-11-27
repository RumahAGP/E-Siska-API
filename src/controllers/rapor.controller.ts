import { Request, Response, NextFunction } from "express";
import {
  generateRaporService,
  inputDataRaporService,
  finalizeRaporService,
  definalizeRaporService,
  overrideNilaiRaporService,
  getMyRaporService,
} from "../service/rapor.service";
import logger from "../utils/logger";

class RaporController {
  public async updateDataRapor(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { siswaId } = req.params;
      const { guruId, tahunAjaranId, catatan, kokurikuler } = req.body;

      const result = await inputDataRaporService({
        guruId,
        siswaId,
        tahunAjaranId,
        catatan,
        kokurikuler,
      });

      res.status(200).send({
        success: true,
        message: "Data rapor berhasil diperbarui",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error update rapor: ${error.message}`);
      }
      next(error);
    }
  }

  public async generate(req: Request, res: Response, next: NextFunction) {
    try {
      const { siswaId } = req.params;
      const { guruId, tahunAjaranId } = req.body;

      const result = await generateRaporService({
        siswaId,
        guruId,
        tahunAjaranId,
      });

      res.status(200).send({
        success: true,
        message: "Data rapor berhasil di-generate",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error generate rapor: ${error.message}`);
      }
      next(error);
    }
  }

  public async finalize(req: Request, res: Response, next: NextFunction) {
    try {
      const { siswaId } = req.params;
      const { guruId, tahunAjaranId } = req.body;

      const result = await finalizeRaporService({
        guruId,
        siswaId,
        tahunAjaranId,
      });

      res.status(200).send({
        success: true,
        message: "Rapor berhasil difinalisasi",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error finalize rapor: ${error.message}`);
      }
      next(error);
    }
  }

  public async definalize(req: Request, res: Response, next: NextFunction) {
    try {
      const { siswaId } = req.params;
      const { guruId, tahunAjaranId } = req.body;

      const result = await definalizeRaporService({
        guruId,
        siswaId,
        tahunAjaranId,
      });

      res.status(200).send({
        success: true,
        message: "Rapor berhasil didefinalisasi",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error definalize rapor: ${error.message}`);
      }
      next(error);
    }
  }

  public async override(req: Request, res: Response, next: NextFunction) {
    try {
      const { siswaId } = req.params;
      const { adminId, mapelId, tahunAjaranId, nilaiAkhir } = req.body;

      const result = await overrideNilaiRaporService({
        adminId,
        siswaId,
        mapelId,
        tahunAjaranId,
        nilaiAkhir,
      });

      res.status(200).send({
        success: true,
        message: "Nilai rapor berhasil di-override",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error override nilai rapor: ${error.message}`);
      }
      next(error);
    }
  }

  public async getMyRapor(req: Request, res: Response, next: NextFunction) {
    try {
      const siswaId = req.user?.siswaId;

      if (!siswaId) {
        throw new Error("Siswa ID not found in request");
      }

      const result = await getMyRaporService(siswaId);

      res.status(200).send({
        success: true,
        message: "Rapor berhasil diambil",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error get my rapor: ${error.message}`);
      }
      next(error);
    }
  }
}

export default RaporController;
