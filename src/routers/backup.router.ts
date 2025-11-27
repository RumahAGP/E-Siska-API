import { Router } from "express";
import BackupController from "../controllers/backup.controller";
import { authMiddleware, adminGuard } from "../middleware/auth.middleware";

class BackupRouter {
  private route: Router;
  private backupController: BackupController;

  constructor() {
    this.route = Router();
    this.backupController = new BackupController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.post(
      "/create",
      authMiddleware,
      adminGuard,
      this.backupController.create
    );

    this.route.get("/", authMiddleware, adminGuard, this.backupController.list);

    this.route.post(
      "/restore",
      authMiddleware,
      adminGuard,
      this.backupController.restore
    );

    this.route.delete(
      "/:filename",
      authMiddleware,
      adminGuard,
      this.backupController.delete
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default BackupRouter;
