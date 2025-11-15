import { Router } from 'express';
import RuanganController from '../controllers/ruangan.controller';
import { createRuanganValidation } from '../middleware/validation/ruangan.validation';
// import { authMiddleware, adminGuard } from '../middleware/auth.middleware';

class RuanganRouter {
  private route: Router;
  private ruanganController: RuanganController;

  constructor() {
    this.route = Router();
    this.ruanganController = new RuanganController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.post(
      '/',
      // authMiddleware, // (Nanti)
      // adminGuard, // (Nanti)
      createRuanganValidation,
      this.ruanganController.create
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default RuanganRouter;