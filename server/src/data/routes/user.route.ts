import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { isAuthenicated } from "../middleware/auth.middleware";
import { validateUserId } from "../middleware/validation.middleware";

const userRouter = Router();

userRouter.post("/users", UserController.handleCreate);
userRouter.post("/login", UserController.handleLogin);
userRouter.post("/logout", isAuthenicated, UserController.handleLogout);
userRouter.get(
  "/users/:userId",
  validateUserId,
  UserController.handlePublicProfile
);

export default userRouter;
