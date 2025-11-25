import { Router } from 'express';
import TahunAjaranController from '../controllers/tahunAjaran.controller';
import { createTahunAjaranValidation } from '../middleware/validation/tahunAjaran.validation';
import { authMiddleware, adminGuard } from '../middleware/auth.middleware';

class TahunAjaranRouter {
  private route: Router;
  private tahunAjaranController: TahunAjaranController;

  constructor() {
    this.route = Router();
    this.tahunAjaranController = new TahunAjaranController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    // Create tahun ajaran - Admin only
    this.route.post(
      '/',
      authMiddleware,
      adminGuard,
      createTahunAjaranValidation,
      this.tahunAjaranController.create
    );

    // List all tahun ajaran - All authenticated users can read
    this.route.get(
      '/',
      authMiddleware,
      this.tahunAjaranController.getAll
    );

    // Get active tahun ajaran - All authenticated users
    this.route.get(
      '/active',
      authMiddleware,
      this.tahunAjaranController.getActive
    );

    // Get tahun ajaran by ID - All authenticated users can read
    this.route.get(
      '/:id',
      authMiddleware,
      this.tahunAjaranController.getById
    );

    // Update tahun ajaran - Admin only
    this.route.put(
      '/:id',
      authMiddleware,
      adminGuard,
      createTahunAjaranValidation,
      this.tahunAjaranController.update
    );

    // Activate tahun ajaran - Admin only (POST for backward compatibility)
    this.route.post(
      '/:id/activate',
      authMiddleware,
      adminGuard,
      this.tahunAjaranController.activate
    );

    // Activate tahun ajaran - Admin only (PATCH - new standard)
    this.route.patch(
      '/:id/active',
      authMiddleware,
      adminGuard,
      this.tahunAjaranController.activate
    );

    // Delete tahun ajaran - Admin only
    this.route.delete(
      '/:id',
      authMiddleware,
      adminGuard,
      this.tahunAjaranController.delete
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default TahunAjaranRouter;