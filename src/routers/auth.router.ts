import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { uploaderMemory } from "../middleware/uploader";
import { loginValidation } from "../middleware/validation/auth";

class AuthRouter {
  private route: Router;
  private authController: AuthController;

  constructor() {
    this.route = Router();
    this.authController = new AuthController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.post("/signin", this.authController.login);

    this.route.post("/signout", this.authController.logout);

    this.route.patch(
      "/profile-img",
      uploaderMemory().single("img"),
      this.authController.changeProfileImg
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default AuthRouter;
