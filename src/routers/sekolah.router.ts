import { Router } from "express";
import SekolahController from "../controllers/sekolah.controller";
import { authMiddleware, adminGuard } from "../middleware/auth.middleware";

class SekolahRouter {
  private route: Router;
  private sekolahController: SekolahController;

  constructor() {
    this.route = Router();
    this.sekolahController = new SekolahController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.get("/", authMiddleware, adminGuard, this.sekolahController.get);

    this.route.post(
      "/",
      authMiddleware,
      adminGuard,
      this.sekolahController.upsert
    );

    this.route.put(
      "/",
      authMiddleware,
      adminGuard,
      this.sekolahController.upsert
    );

    this.route.delete(
      "/",
      authMiddleware,
      adminGuard,
      this.sekolahController.delete
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default SekolahRouter;
