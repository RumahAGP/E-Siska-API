import { Router } from 'express';
import GuruController from '../controllers/guru.controller';
import { createGuruValidation } from '../middleware/validation/guru.validation';
// import { authMiddleware, adminGuard } from '../middleware/auth.middleware'; // (Akan dibuat nanti)

class GuruRouter {
  private route: Router;
  private guruController: GuruController;

  constructor() {
    this.route = Router();
    this.guruController = new GuruController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.post(
      '/',
      // authMiddleware, // (Nanti)
      // adminGuard, // (Nanti)
      createGuruValidation, // Terapkan validasi
      this.guruController.create
    );

    // (Nanti kita tambahkan route lain: GET /, GET /:id, PATCH /:id, DELETE /:id)
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default GuruRouter;