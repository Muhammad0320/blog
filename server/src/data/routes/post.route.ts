import { Router } from "express";
import { PostController } from "../controller/post.controllers";
import { validatePostId } from "../middleware/validation.middleware";

const postRoutes = Router();

postRoutes.get("/posts", PostController.handleGetAllPosts);
postRoutes.post("/posts", PostController.handleCreatePost);

postRoutes.get("/posts/:id", validatePostId, PostController.handleGetPostById);
postRoutes.patch("/posts/:id", validatePostId, PostController.handleUpdatePost);
postRoutes.delete(
  "/posts/:id",
  validatePostId,
  PostController.handleDeletePost
);

export default postRoutes;
