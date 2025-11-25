import { Router } from 'express';
import NilaiController from '../controllers/nilai.controller';
import { inputNilaiValidation } from '../middleware/validation/nilai.validation';
import { authMiddleware, guruGuard } from '../middleware/auth.middleware';

class NilaiRouter {
  private route: Router;
  private nilaiController: NilaiController;

  constructor() {
    this.route = Router();
    this.nilaiController = new NilaiController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    // Input nilai - Guru only
    this.route.post(
      '/',
      authMiddleware,
      guruGuard,
      inputNilaiValidation,
      this.nilaiController.inputNilai
    );

    // Get Nilai Kelas - Guru only
    this.route.get(
      '/kelas/:kelasId/mapel/:mapelId',
      authMiddleware,
      guruGuard,
      this.nilaiController.getNilaiKelas
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default NilaiRouter;