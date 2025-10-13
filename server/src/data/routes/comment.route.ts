import { Router } from "express";
import { CommentController } from "../controller/comment,controller";
import { validatePostId } from "../middleware/validation.middleware";

const commentRoutes = Router();

commentRoutes.get(
  "/comments/:id",
  validatePostId,
  CommentController.handleGetAllForPosts
);
commentRoutes.post("/comments", CommentController.handleCreate);

export default commentRoutes;
