import { Router } from "express";
import { UserController } from "../controller/user.controller";

const userRouter = Router();

// /users or /signup 🤔?
userRouter.post("/users", UserController.handleCreate);

// Why are routers ususally exortes at the last line with export default
export default userRouter;
