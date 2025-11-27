import { Router } from "express";
import TingkatanController from "../controllers/tingkatan.controller";
import { createTingkatanValidation } from "../middleware/validation/tingkatan.validation";
import { authMiddleware, adminGuard } from "../middleware/auth.middleware";

class TingkatanRouter {
  private route: Router;
  private tingkatanController: TingkatanController;

  constructor() {
    this.route = Router();
    this.tingkatanController = new TingkatanController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.post(
      "/",
      authMiddleware,
      adminGuard,
      createTingkatanValidation,
      this.tingkatanController.create
    );

    this.route.get(
      "/",
      authMiddleware,
      adminGuard,
      this.tingkatanController.getAll
    );

    this.route.put(
      "/:id",
      authMiddleware,
      adminGuard,
      createTingkatanValidation,
      this.tingkatanController.update
    );

    this.route.delete(
      "/:id",
      authMiddleware,
      adminGuard,
      this.tingkatanController.delete
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default TingkatanRouter;
