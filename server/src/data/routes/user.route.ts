import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { isAuthenicated } from "../middleware/auth.middleware";

const userRouter = Router();

userRouter.post("/users", UserController.handleCreate);
userRouter.post("/login", UserController.handleLogin);
userRouter.post("/logout", isAuthenicated, UserController.handleLogout);

export default userRouter;
