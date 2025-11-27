import { Router } from "express";
import RaporController from "../controllers/rapor.controller";
import {
  authMiddleware,
  guruGuard,
  waliKelasGuard,
  adminGuard,
  siswaGuard,
} from "../middleware/auth.middleware";

class RaporRouter {
  private route: Router;
  private raporController: RaporController;

  constructor() {
    this.route = Router();
    this.raporController = new RaporController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.put(
      "/siswa/:siswaId",
      authMiddleware,
      waliKelasGuard,
      this.raporController.updateDataRapor
    );

    this.route.post(
      "/siswa/:siswaId/generate",
      authMiddleware,
      waliKelasGuard,
      this.raporController.generate
    );

    this.route.post(
      "/siswa/:siswaId/finalize",
      authMiddleware,
      waliKelasGuard,
      this.raporController.finalize
    );

    this.route.post(
      "/siswa/:siswaId/definalize",
      authMiddleware,
      waliKelasGuard,
      this.raporController.definalize
    );

    this.route.post(
      "/siswa/:siswaId/override",
      authMiddleware,
      adminGuard,
      this.raporController.override
    );

    this.route.get(
      "/me",
      authMiddleware,
      siswaGuard,
      this.raporController.getMyRapor
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default RaporRouter;
