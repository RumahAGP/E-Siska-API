import { Router } from 'express';
import DokumenController from '../controllers/dokumen.controller';
import { createDokumenValidation } from '../middleware/validation/dokumen.validation';
import { uploaderMemory } from '../middleware/uploader'; // Impor uploader
// import { authMiddleware, adminGuard } from '../middleware/auth.middleware';

class DokumenRouter {
  private route: Router;
  private dokumenController: DokumenController;

  constructor() {
    this.route = Router();
    this.dokumenController = new DokumenController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.post(
      '/',
      // authMiddleware, // (Nanti)
      // adminGuard, // (Nanti)
      uploaderMemory().single('file'), // Middleware multer untuk 'file'
      createDokumenValidation,
      this.dokumenController.create
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default DokumenRouter;