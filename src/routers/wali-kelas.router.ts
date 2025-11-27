import { Router } from "express";
import WaliKelasController from "../controllers/wali-kelas.controller";
import { authMiddleware, waliKelasGuard } from "../middleware/auth.middleware";

class WaliKelasRouter {
  private route: Router;
  private waliKelasController: WaliKelasController;

  constructor() {
    this.route = Router();
    this.waliKelasController = new WaliKelasController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.get(
      "/my-kelas",
      authMiddleware,
      waliKelasGuard,
      this.waliKelasController.getMyKelas
    );

    this.route.get(
      "/kelas/:kelasId/rekap-nilai",
      authMiddleware,
      waliKelasGuard,
      this.waliKelasController.getRekapNilai
    );

    this.route.get(
      "/kelas/:kelasId/rekap-absensi",
      authMiddleware,
      waliKelasGuard,
      this.waliKelasController.getRekapAbsensi
    );

    this.route.get(
      "/kelas/:kelasId/siswa",
      authMiddleware,
      waliKelasGuard,
      this.waliKelasController.getDataSiswa
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default WaliKelasRouter;
