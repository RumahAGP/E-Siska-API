import { Router } from 'express';
import AbsensiController from '../controllers/absensi.controller';
import AbsensiDetailController from '../controllers/absensiDetail.controller'; // 1. Impor controller baru
import { createSesiValidation } from '../middleware/validation/absensi.validation';
import { inputAbsensiValidation } from '../middleware/validation/absensiDetail.validation'; // 2. Impor validator baru

class AbsensiRouter {
  private route: Router;
  private absensiController: AbsensiController;
  private absensiDetailController: AbsensiDetailController; // 3. Property baru

  constructor() {
    this.route = Router();
    this.absensiController = new AbsensiController();
    this.absensiDetailController = new AbsensiDetailController(); // 4. Init controller baru
    this.initializeRoute();
  }

  private initializeRoute(): void {
    // 1. Buat Sesi Pertemuan
    this.route.post(
      '/sesi',
      createSesiValidation,
      this.absensiController.createSesi
    );

    // 2. Input Detail Absensi (BARU)
    this.route.post(
      '/sesi/:sesiId/detail',
      inputAbsensiValidation,
      this.absensiDetailController.inputAbsensi
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default AbsensiRouter;