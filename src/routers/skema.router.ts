import { Router } from "express";
import SkemaController from "../controllers/skema.controller";
import { addKomponenValidation } from "../middleware/validation/skema.validation";
import { authMiddleware, adminGuard } from "../middleware/auth.middleware";

class SkemaRouter {
  private route: Router;
  private skemaController: SkemaController;

  constructor() {
    this.route = Router();
    this.skemaController = new SkemaController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.post(
      "/:skemaId/komponen",
      authMiddleware,
      adminGuard,
      addKomponenValidation,
      this.skemaController.addKomponen
    );

    this.route.get(
      "/mapel/:mapelId",
      authMiddleware,
      this.skemaController.getSkema
    );

    this.route.delete(
      "/komponen/:komponenId",
      authMiddleware,
      adminGuard,
      this.skemaController.deleteKomponen
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default SkemaRouter;
