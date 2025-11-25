import { Router } from 'express';
import PengumumanController from '../controllers/pengumuman.controller';
import { createPengumumanValidation } from '../middleware/validation/pengumuman.validation';
import { authMiddleware, adminGuard } from '../middleware/auth.middleware';

class PengumumanRouter {
  private route: Router;
  private pengumumanController: PengumumanController;

  constructor() {
    this.route = Router();
    this.pengumumanController = new PengumumanController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    // Create pengumuman - Admin only
    this.route.post(
      '/',
      authMiddleware,
      adminGuard,
      createPengumumanValidation,
      this.pengumumanController.create
    );

    // List all pengumuman - All authenticated users can read
    this.route.get(
      '/',
      authMiddleware,
      this.pengumumanController.getAll
    );

    // Get pengumuman by ID - All authenticated users can read
    this.route.get(
      '/:id',
      authMiddleware,
      this.pengumumanController.getById
    );

    // Update pengumuman - Admin only
    this.route.put(
      '/:id',
      authMiddleware,
      adminGuard,
      createPengumumanValidation,
      this.pengumumanController.update
    );

    // Delete pengumuman - Admin only
    this.route.delete(
      '/:id',
      authMiddleware,
      adminGuard,
      this.pengumumanController.delete
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default PengumumanRouter;