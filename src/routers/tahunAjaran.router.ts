import { Router } from "express";
import TahunAjaranController from "../controllers/tahunAjaran.controller";
import { createTahunAjaranValidation } from "../middleware/validation/tahunAjaran.validation";
import { authMiddleware, adminGuard } from "../middleware/auth.middleware";

class TahunAjaranRouter {
  private route: Router;
  private tahunAjaranController: TahunAjaranController;

  constructor() {
    this.route = Router();
    this.tahunAjaranController = new TahunAjaranController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.post(
      "/",
      authMiddleware,
      adminGuard,
      createTahunAjaranValidation,
      this.tahunAjaranController.create
    );

    this.route.get("/", authMiddleware, this.tahunAjaranController.getAll);

    this.route.get(
      "/active",
      authMiddleware,
      this.tahunAjaranController.getActive
    );

    this.route.get("/:id", authMiddleware, this.tahunAjaranController.getById);

    this.route.put(
      "/:id",
      authMiddleware,
      adminGuard,
      createTahunAjaranValidation,
      this.tahunAjaranController.update
    );

    this.route.post(
      "/:id/activate",
      authMiddleware,
      adminGuard,
      this.tahunAjaranController.activate
    );

    this.route.patch(
      "/:id/active",
      authMiddleware,
      adminGuard,
      this.tahunAjaranController.activate
    );

    this.route.delete(
      "/:id",
      authMiddleware,
      adminGuard,
      this.tahunAjaranController.delete
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default TahunAjaranRouter;
