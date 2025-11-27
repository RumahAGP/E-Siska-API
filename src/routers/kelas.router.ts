import { Router } from "express";
import KelasController from "../controllers/kelas.controller";
import { createKelasValidation } from "../middleware/validation/kelas.validation";
import {
  authMiddleware,
  adminGuard,
  guruGuard,
} from "../middleware/auth.middleware";

class KelasRouter {
  private route: Router;
  private kelasController: KelasController;

  constructor() {
    this.route = Router();
    this.kelasController = new KelasController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.post(
      "/",
      authMiddleware,
      adminGuard,
      createKelasValidation,
      this.kelasController.create
    );

    this.route.get("/", authMiddleware, this.kelasController.getAll);

    this.route.get(
      "/my-class",
      authMiddleware,
      guruGuard,
      this.kelasController.getMyClass
    );

    this.route.get(
      "/teaching",
      authMiddleware,
      guruGuard,
      this.kelasController.getMyTeachingClasses
    );

    this.route.put(
      "/:id",
      authMiddleware,
      adminGuard,
      this.kelasController.update
    );

    this.route.delete(
      "/:id",
      authMiddleware,
      adminGuard,
      this.kelasController.delete
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default KelasRouter;
