import { Router } from 'express';
import JadwalController from '../controllers/jadwal.controller';
import { createJadwalValidation } from '../middleware/validation/jadwal.validation';
import { authMiddleware, adminGuard } from '../middleware/auth.middleware';

class JadwalRouter {
  private route: Router;
  private jadwalController: JadwalController;

  constructor() {
    this.route = Router();
    this.jadwalController = new JadwalController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    // Create jadwal - Admin only
    this.route.post(
      '/',
      authMiddleware,
      adminGuard,
      createJadwalValidation,
      this.jadwalController.create
    );

    // List all jadwal - Admin only (with optional filters)
    this.route.get(
      '/',
      authMiddleware,
      adminGuard,
      this.jadwalController.getAll
    );

    // Get jadwal by ID - Admin only
    this.route.get(
      '/:id',
      authMiddleware,
      adminGuard,
      this.jadwalController.getById
    );

    // Update jadwal - Admin only
    this.route.put(
      '/:id',
      authMiddleware,
      adminGuard,
      createJadwalValidation,
      this.jadwalController.update
    );

    // Delete jadwal - Admin only
    this.route.delete(
      '/:id',
      authMiddleware,
      adminGuard,
      this.jadwalController.delete
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default JadwalRouter;