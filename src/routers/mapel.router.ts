import { Router } from 'express';
import MapelController from '../controllers/mapel.controller';
import { createMapelValidation } from '../middleware/validation/mapel.validation';
import { authMiddleware, adminGuard } from '../middleware/auth.middleware';

class MapelRouter {
  private route: Router;
  private mapelController: MapelController;

  constructor() {
    this.route = Router();
    this.mapelController = new MapelController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.post(
      '/',
      authMiddleware,
      adminGuard,
      createMapelValidation,
      this.mapelController.create
    );

    this.route.get(
      '/',
      authMiddleware,
      this.mapelController.getAll
    );

    this.route.put(
      '/:id',
      authMiddleware,
      adminGuard,
      this.mapelController.update
    );

    this.route.delete(
      '/:id',
      authMiddleware,
      adminGuard,
      this.mapelController.delete
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default MapelRouter;