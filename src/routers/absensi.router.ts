import { Router } from "express";
import AbsensiController from "../controllers/absensi.controller";
import AbsensiDetailController from "../controllers/absensiDetail.controller";
import { createSesiValidation } from "../middleware/validation/absensi.validation";
import { inputAbsensiValidation } from "../middleware/validation/absensiDetail.validation";
import { authMiddleware, guruGuard } from "../middleware/auth.middleware";

class AbsensiRouter {
  private route: Router;
  private absensiController: AbsensiController;
  private absensiDetailController: AbsensiDetailController;

  constructor() {
    this.route = Router();
    this.absensiController = new AbsensiController();
    this.absensiDetailController = new AbsensiDetailController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.get("/", authMiddleware, (req, res) => {
      res.status(200).send({
        success: true,
        message: "Data absensi berhasil diambil",
        data: [],
      });
    });

    this.route.post(
      "/sesi",
      authMiddleware,
      guruGuard,
      createSesiValidation,
      this.absensiController.createSesi
    );

    this.route.get(
      "/kelas/:kelasId",
      authMiddleware,
      guruGuard,
      this.absensiController.getSesiByKelas
    );

    this.route.get(
      "/sesi/:sesiId",
      authMiddleware,
      guruGuard,
      this.absensiController.getSesiDetail
    );

    this.route.post(
      "/sesi/:sesiId/detail",
      authMiddleware,
      guruGuard,
      inputAbsensiValidation,
      this.absensiDetailController.inputAbsensi
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default AbsensiRouter;
