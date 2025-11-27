import { Router } from "express";
import PenempatanController from "../controllers/penempatan.controller";
import { createPenempatanValidation } from "../middleware/validation/penempatan.validation";
import { authMiddleware, adminGuard } from "../middleware/auth.middleware";

class PenempatanRouter {
  private route: Router;
  private penempatanController: PenempatanController;

  constructor() {
    this.route = Router();
    this.penempatanController = new PenempatanController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.post(
      "/",
      authMiddleware,
      adminGuard,
      createPenempatanValidation,
      this.penempatanController.create
    );

    this.route.get("/", authMiddleware, this.penempatanController.getAll);

    this.route.get("/:id", authMiddleware, this.penempatanController.getById);

    this.route.put(
      "/:id",
      authMiddleware,
      adminGuard,
      createPenempatanValidation,
      this.penempatanController.update
    );

    this.route.delete(
      "/:id",
      authMiddleware,
      adminGuard,
      this.penempatanController.delete
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default PenempatanRouter;
