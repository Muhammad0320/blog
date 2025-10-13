import { Router } from "express";
import { validatePostId } from "./post.route";
import { CommentController } from "../controller/comment,controller";

const commentRoutes = Router();

// Will I have to extract validatePostId middleware into another function?

commentRoutes.get(
  "/comments/:id",
  validatePostId,
  CommentController.handleGetAllForPosts
);
commentRoutes.post("/comments", CommentController.handleCreate);

export default commentRoutes;
