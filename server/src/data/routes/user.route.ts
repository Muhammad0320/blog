import { Router } from "express";
import { UserController } from "../controller/user.controller";

const userRouter = Router();

userRouter.post("/users", UserController.handleCreate);
userRouter.post("/login", UserController.handleLogin);

export default userRouter;
