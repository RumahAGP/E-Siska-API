import { Router } from 'express';
import RaporController from '../controllers/rapor.controller';
import { inputRaporValidation } from '../middleware/validation/rapor.validation';

class RaporRouter {
  private route: Router;
  private raporController: RaporController;

  constructor() {
    this.route = Router();
    this.raporController = new RaporController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    // Update Data Rapor (Catatan & Kokurikuler)
    this.route.put(
      '/siswa/:siswaId',
      inputRaporValidation,
      this.raporController.updateDataRapor
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default RaporRouter;