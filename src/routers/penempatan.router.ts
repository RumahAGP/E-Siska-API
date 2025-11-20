import { Router } from 'express';
import PenempatanController from '../controllers/penempatan.controller';
import { createPenempatanValidation } from '../middleware/validation/penempatan.validation';
import { authMiddleware, adminGuard } from '../middleware/auth.middleware';

class PenempatanRouter {
  private route: Router;
  private penempatanController: PenempatanController;

  constructor() {
    this.route = Router();
    this.penempatanController = new PenempatanController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    // Create penempatan - Admin only
    this.route.post(
      '/',
      authMiddleware,
      adminGuard,
      createPenempatanValidation,
      this.penempatanController.create
    );

    // List all penempatan - Admin only (with optional filters)
    this.route.get(
      '/',
      authMiddleware,
      adminGuard,
      this.penempatanController.getAll
    );

    // Get penempatan by ID - Admin only
    this.route.get(
      '/:id',
      authMiddleware,
      adminGuard,
      this.penempatanController.getById
    );

    // Update penempatan - Admin only
    this.route.put(
      '/:id',
      authMiddleware,
      adminGuard,
      createPenempatanValidation,
      this.penempatanController.update
    );

    // Delete penempatan - Admin only
    this.route.delete(
      '/:id',
      authMiddleware,
      adminGuard,
      this.penempatanController.delete
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default PenempatanRouter;