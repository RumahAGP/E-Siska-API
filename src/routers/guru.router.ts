import { Router } from 'express';
import GuruController from '../controllers/guru.controller';
import { createGuruValidation } from '../middleware/validation/guru.validation';
import { authMiddleware, adminGuard } from '../middleware/auth.middleware';

class GuruRouter {
  private route: Router;
  private guruController: GuruController;

  constructor() {
    this.route = Router();
    this.guruController = new GuruController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    // Create - Admin only
    this.route.post(
      '/',
      authMiddleware,
      adminGuard,
      createGuruValidation,
      this.guruController.create
    );

    // Read All - All authenticated users can read
    this.route.get(
      '/',
      authMiddleware,
      this.guruController.getAll
    );

    // Read One - All authenticated users can read
    this.route.get(
      '/:id',
      authMiddleware,
      this.guruController.getById
    );

    // Update - Admin only
    this.route.put(
      '/:id',
      authMiddleware,
      adminGuard,
      this.guruController.update
    );

    // Delete - Admin only
    this.route.delete(
      '/:id',
      authMiddleware,
      adminGuard,
      this.guruController.delete
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default GuruRouter;