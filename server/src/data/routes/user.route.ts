import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { isAuthenicated } from "../middleware/auth.middleware";
import { validateUserId } from "../middleware/validation.middleware";
import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again in 15 minutes",
});

const userRouter = Router();

userRouter.post("/users", authLimiter, UserController.handleCreate);
userRouter.post("/login", authLimiter, UserController.handleLogin);
userRouter.post(
  "/logout",
  authLimiter,
  isAuthenicated,
  UserController.handleLogout
);
userRouter.get(
  "/users/:userId",
  validateUserId,
  UserController.handlePublicProfile
);

export default userRouter;
