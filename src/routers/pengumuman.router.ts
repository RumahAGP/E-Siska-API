import { Router } from "express";
import PengumumanController from "../controllers/pengumuman.controller";
import { createPengumumanValidation } from "../middleware/validation/pengumuman.validation";
import { authMiddleware, adminGuard } from "../middleware/auth.middleware";

class PengumumanRouter {
  private route: Router;
  private pengumumanController: PengumumanController;

  constructor() {
    this.route = Router();
    this.pengumumanController = new PengumumanController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.post(
      "/",
      authMiddleware,
      adminGuard,
      createPengumumanValidation,
      this.pengumumanController.create
    );

    this.route.get("/", authMiddleware, this.pengumumanController.getAll);

    this.route.get("/:id", authMiddleware, this.pengumumanController.getById);

    this.route.put(
      "/:id",
      authMiddleware,
      adminGuard,
      createPengumumanValidation,
      this.pengumumanController.update
    );

    this.route.delete(
      "/:id",
      authMiddleware,
      adminGuard,
      this.pengumumanController.delete
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default PengumumanRouter;
