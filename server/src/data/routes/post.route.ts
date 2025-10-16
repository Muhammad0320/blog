import { Router } from "express";
import { validatePostId } from "../middleware/validation.middleware";
import { PostController } from "../controller/post.controller";
import { isAuthenicated, canModifyPost } from "../middleware/auth.middleware";

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
  canModifyPost,
  PostController.handleUpdatePost
);
postRoutes.delete(
  "/posts/:postId",
  validatePostId,
  isAuthenicated,
  canModifyPost,
  PostController.handleDeletePost
);

export default postRoutes;
