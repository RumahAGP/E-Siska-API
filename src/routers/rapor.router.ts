import { Router } from 'express';
import RaporController from '../controllers/rapor.controller';
import { authMiddleware, guruGuard, waliKelasGuard, adminGuard, siswaGuard } from '../middleware/auth.middleware';

class RaporRouter {
  private route: Router;
  private raporController: RaporController;

  constructor() {
    this.route = Router();
    this.raporController = new RaporController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    // Update rapor data - Wali Kelas only
    this.route.put(
      '/siswa/:siswaId',
      authMiddleware,
      waliKelasGuard,
      this.raporController.updateDataRapor
    );

    // Generate rapor - Wali Kelas only
    this.route.post(
      '/siswa/:siswaId/generate',
      authMiddleware,
      waliKelasGuard,
      this.raporController.generate
    );

    // Finalize rapor - Wali Kelas only
    this.route.post(
      '/siswa/:siswaId/finalize',
      authMiddleware,
      waliKelasGuard,
      this.raporController.finalize
    );

    // Definalize rapor - Wali Kelas only
    this.route.post(
      '/siswa/:siswaId/definalize',
      authMiddleware,
      waliKelasGuard,
      this.raporController.definalize
    );

    // Override nilai rapor - Admin only
    this.route.post(
      '/siswa/:siswaId/override',
      authMiddleware,
      adminGuard,
      this.raporController.override
    );

    // Get My Rapor - Siswa only
    this.route.get(
      '/me',
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