import { Router } from 'express';
import JadwalController from '../controllers/jadwal.controller';
import { createJadwalValidation } from '../middleware/validation/jadwal.validation';
// import { authMiddleware, adminGuard } from '../middleware/auth.middleware';

class JadwalRouter {
  private route: Router;
  private jadwalController: JadwalController;

  constructor() {
    this.route = Router();
    this.jadwalController = new JadwalController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.post(
      '/',
      // authMiddleware, // (Nanti)
      // adminGuard, // (Nanti)
      createJadwalValidation,
      this.jadwalController.create
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default JadwalRouter;