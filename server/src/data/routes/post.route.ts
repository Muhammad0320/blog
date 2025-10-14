import { Router } from "express";
import { validatePostId } from "../middleware/validation.middleware";
import { PostController } from "../controller/post.controller";

const postRoutes = Router();

postRoutes.get("/posts", PostController.handleGetAllPosts);
postRoutes.post("/posts", PostController.handleCreatePost);

postRoutes.get(
  "/posts/:postId",
  validatePostId,
  PostController.handleGetPostById
);
postRoutes.patch(
  "/posts/:postId",
  validatePostId,
  PostController.handleUpdatePost
);
postRoutes.delete(
  "/posts/:postId",
  validatePostId,
  PostController.handleDeletePost
);

export default postRoutes;
