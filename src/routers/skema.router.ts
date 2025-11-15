import { Router } from 'express';
import SkemaController from '../controllers/skema.controller';
import { addKomponenValidation } from '../middleware/validation/skema.validation';
// import { authMiddleware, adminGuard } from '../middleware/auth.middleware';

class SkemaRouter {
  private route: Router;
  private skemaController: SkemaController;

  constructor() {
    this.route = Router();
    this.skemaController = new SkemaController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    // Endpoint: POST /skema/:skemaId/komponen
    this.route.post(
      '/:skemaId/komponen',
      // authMiddleware, // (Nanti)
      // adminGuard, // (Nanti)
      addKomponenValidation, // Terapkan validasi
      this.skemaController.addKomponen
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default SkemaRouter;