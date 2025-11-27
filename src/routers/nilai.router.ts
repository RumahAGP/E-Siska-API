import { Router } from "express";
import NilaiController from "../controllers/nilai.controller";
import { inputNilaiValidation } from "../middleware/validation/nilai.validation";
import {
  authMiddleware,
  guruGuard,
  siswaGuard,
  adminGuard,
} from "../middleware/auth.middleware";

class NilaiRouter {
  private route: Router;
  private nilaiController: NilaiController;

  constructor() {
    this.route = Router();
    this.nilaiController = new NilaiController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.get("/", authMiddleware, this.nilaiController.getAll);

    this.route.post(
      "/",
      authMiddleware,
      guruGuard,
      inputNilaiValidation,
      this.nilaiController.inputNilai
    );

    this.route.get(
      "/kelas/:kelasId/mapel/:mapelId",
      authMiddleware,
      guruGuard,
      this.nilaiController.getNilaiKelas
    );

    this.route.get(
      "/me",
      authMiddleware,
      siswaGuard,
      this.nilaiController.getMyGrades
    );

    this.route.put(
      "/:id",
      authMiddleware,
      guruGuard,
      this.nilaiController.update
    );

    this.route.delete(
      "/:id",
      authMiddleware,
      guruGuard,
      this.nilaiController.delete
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default NilaiRouter;
