import { Router } from "express";
import { validatePostId } from "../middleware/validation.middleware";
import { PostController } from "../controller/post.controller";
import { isAuthenicated, canModifyPost } from "../middleware/auth.middleware";
import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "You have exceeded the 100 requests in 15 minutes",
});

const postRoutes = Router();

postRoutes.get("/posts", PostController.handleGetAllPosts);
postRoutes.get(
  "/posts/:postId",
  validatePostId,
  PostController.handleGetPostById
);

postRoutes.post(
  "/posts",
  apiLimiter,
  isAuthenicated,
  PostController.handleCreatePost
);
postRoutes.patch(
  "/posts/:postId",
  validatePostId,
  apiLimiter,
  isAuthenicated,
  canModifyPost,
  PostController.handleUpdatePost
);
postRoutes.delete(
  "/posts/:postId",
  validatePostId,
  apiLimiter,
  isAuthenicated,
  canModifyPost,
  PostController.handleDeletePost
);

export default postRoutes;
