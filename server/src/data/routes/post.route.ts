import { Router } from "express";
import { validatePostId } from "../middleware/validation.middleware";
import { PostController } from "../controller/post.controller";
import { isAuthenicated } from "../middleware/auth.middleware";

const postRoutes = Router();

postRoutes.get("/posts", PostController.handleGetAllPosts);
postRoutes.get(
  "/posts/:postId",
  validatePostId,
  PostController.handleGetPostById
);

postRoutes.post("/posts", isAuthenicated, PostController.handleCreatePost);
postRoutes.patch(
  "/posts/:postId",
  validatePostId,
  isAuthenicated,
  PostController.handleUpdatePost
);
postRoutes.delete(
  "/posts/:postId",
  validatePostId,
  isAuthenicated,
  PostController.handleDeletePost
);

export default postRoutes;
