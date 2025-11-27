import { Router } from "express";
import SiswaViewController from "../controllers/siswa-view.controller";
import { authMiddleware, siswaGuard } from "../middleware/auth.middleware";

class SiswaViewRouter {
  private route: Router;
  private siswaViewController: SiswaViewController;

  constructor() {
    this.route = Router();
    this.siswaViewController = new SiswaViewController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.get(
      "/my/absensi",
      authMiddleware,
      siswaGuard,
      this.siswaViewController.getMyAbsensi
    );

    this.route.get(
      "/my/nilai",
      authMiddleware,
      siswaGuard,
      this.siswaViewController.getMyNilai
    );

    this.route.get(
      "/my/jadwal",
      authMiddleware,
      siswaGuard,
      this.siswaViewController.getMyJadwal
    );

    this.route.get(
      "/pengumuman",
      authMiddleware,
      siswaGuard,
      this.siswaViewController.getPengumuman
    );

    this.route.get(
      "/dokumen",
      authMiddleware,
      siswaGuard,
      this.siswaViewController.getDokumen
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default SiswaViewRouter;
