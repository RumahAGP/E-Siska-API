import { Router } from 'express';
import PenugasanController from '../controllers/penugasan.controller';
import { createPenugasanValidation } from '../middleware/validation/penugasan.validation';
import { authMiddleware, adminGuard } from '../middleware/auth.middleware';

class PenugasanRouter {
  private route: Router;
  private penugasanController: PenugasanController;

  constructor() {
    this.route = Router();
    this.penugasanController = new PenugasanController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    // Create penugasan - Admin only
    this.route.post(
      '/',
      authMiddleware,
      adminGuard,
      createPenugasanValidation,
      this.penugasanController.create
    );

    // List all penugasan - Admin only (with optional filters)
    this.route.get(
      '/',
      authMiddleware,
      adminGuard,
      this.penugasanController.getAll
    );

    // Get penugasan by ID - Admin only
    this.route.get(
      '/:id',
      authMiddleware,
      adminGuard,
      this.penugasanController.getById
    );

    // Update penugasan - Admin only
    this.route.put(
      '/:id',
      authMiddleware,
      adminGuard,
      createPenugasanValidation,
      this.penugasanController.update
    );

    // Delete penugasan - Admin only
    this.route.delete(
      '/:id',
      authMiddleware,
      adminGuard,
      this.penugasanController.delete
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default PenugasanRouter;