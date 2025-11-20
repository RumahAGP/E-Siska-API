import { Router } from 'express';
import GuruViewController from '../controllers/guru-view.controller';
import { authMiddleware, guruGuard } from '../middleware/auth.middleware';

class GuruViewRouter {
  private route: Router;
  private guruViewController: GuruViewController;

  constructor() {
    this.route = Router();
    this.guruViewController = new GuruViewController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    // Get my teaching schedule - Guru only
    this.route.get(
      '/my-jadwal',
      authMiddleware,
      guruGuard,
      this.guruViewController.getMyJadwal
    );

    // Get pengumuman - Guru only
    this.route.get(
      '/pengumuman',
      authMiddleware,
      guruGuard,
      this.guruViewController.getPengumuman
    );

    // Get dokumen - Guru only
    this.route.get(
      '/dokumen',
      authMiddleware,
      guruGuard,
      this.guruViewController.getDokumen
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default GuruViewRouter;
