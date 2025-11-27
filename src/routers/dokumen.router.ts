import { Router } from "express";
import DokumenController from "../controllers/dokumen.controller";
import { createDokumenValidation } from "../middleware/validation/dokumen.validation";
import { uploaderMemory } from "../middleware/uploader";
import { authMiddleware, adminGuard } from "../middleware/auth.middleware";

class DokumenRouter {
  private route: Router;
  private dokumenController: DokumenController;

  constructor() {
    this.route = Router();
    this.dokumenController = new DokumenController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.post(
      "/",
      authMiddleware,
      adminGuard,
      uploaderMemory().single("file"),
      createDokumenValidation,
      this.dokumenController.create
    );

    this.route.get(
      "/",
      authMiddleware,
      adminGuard,
      this.dokumenController.getAll
    );

    this.route.delete(
      "/:id",
      authMiddleware,
      adminGuard,
      this.dokumenController.delete
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default DokumenRouter;
