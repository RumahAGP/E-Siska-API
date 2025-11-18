import { Router } from 'express';
import NilaiController from '../controllers/nilai.controller';
import { inputNilaiValidation } from '../middleware/validation/nilai.validation';

class NilaiRouter {
  private route: Router;
  private nilaiController: NilaiController;

  constructor() {
    this.route = Router();
    this.nilaiController = new NilaiController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.post(
      '/',
      inputNilaiValidation,
      this.nilaiController.inputNilai
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default NilaiRouter;