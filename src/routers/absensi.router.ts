import { Router } from 'express';
import AbsensiController from '../controllers/absensi.controller';
import AbsensiDetailController from '../controllers/absensiDetail.controller';
import { createSesiValidation } from '../middleware/validation/absensi.validation';
import { inputAbsensiValidation } from '../middleware/validation/absensiDetail.validation';
import { authMiddleware, guruGuard } from '../middleware/auth.middleware';

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
    // Get Absensi - All authenticated users (temporary - returns empty array)
    this.route.get(
      '/',
      authMiddleware,
      (req, res) => {
        // TODO: Implement proper absensi fetching logic with filters
        res.status(200).send({
          success: true,
          message: "Data absensi berhasil diambil",
          data: [],
        });
      }
    );

    // Create Sesi Pertemuan - Guru only
    this.route.post(
      '/sesi',
      authMiddleware,
      guruGuard,
      createSesiValidation,
      this.absensiController.createSesi
    );

    // Get Sesi by Kelas - Guru only
    this.route.get(
      '/kelas/:kelasId',
      authMiddleware,
      guruGuard,
      this.absensiController.getSesiByKelas
    );

    // Get Sesi Detail (with students) - Guru only
    this.route.get(
      '/sesi/:sesiId',
      authMiddleware,
      guruGuard,
      this.absensiController.getSesiDetail
    );

    // Input Detail Absensi - Guru only
    this.route.post(
      '/sesi/:sesiId/detail',
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