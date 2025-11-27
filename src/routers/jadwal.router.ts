import { Router } from "express";
import JadwalController from "../controllers/jadwal.controller";
import { createJadwalValidation } from "../middleware/validation/jadwal.validation";
import { authMiddleware, adminGuard } from "../middleware/auth.middleware";

class JadwalRouter {
  private route: Router;
  private jadwalController: JadwalController;

  constructor() {
    this.route = Router();
    this.jadwalController = new JadwalController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.post(
      "/",
      authMiddleware,
      adminGuard,
      createJadwalValidation,
      this.jadwalController.create
    );

    this.route.get("/", authMiddleware, this.jadwalController.getAll);

    this.route.get("/:id", authMiddleware, this.jadwalController.getById);

    this.route.put(
      "/:id",
      authMiddleware,
      adminGuard,
      createJadwalValidation,
      this.jadwalController.update
    );

    this.route.delete(
      "/:id",
      authMiddleware,
      adminGuard,
      this.jadwalController.delete
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default JadwalRouter;
