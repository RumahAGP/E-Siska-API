import { Router } from 'express';
import PenugasanController from '../controllers/penugasan.controller';
import { createPenugasanValidation } from '../middleware/validation/penugasan.validation';
// import { authMiddleware, adminGuard } from '../middleware/auth.middleware';

class PenugasanRouter {
  private route: Router;
  private penugasanController: PenugasanController;

  constructor() {
    this.route = Router();
    this.penugasanController = new PenugasanController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.post(
      '/',
      // authMiddleware, // (Nanti)
      // adminGuard, // (Nanti)
      createPenugasanValidation,
      this.penugasanController.create
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default PenugasanRouter;