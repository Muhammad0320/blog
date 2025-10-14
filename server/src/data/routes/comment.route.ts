import { Router } from "express";
import { validateCommentId } from "../middleware/validation.middleware";
import { CommentController } from "../controller/comment.controller";

const commentRouter = Router();

commentRouter.get(
  "/posts/:id/comments",
  validateCommentId,
  CommentController.handleGetAllForPosts
);
commentRouter.post(
  "/posts/:id/comments",
  validateCommentId,
  CommentController.handleCreate
);

commentRouter.delete(
  "/comments/:id",
  validateCommentId,
  CommentController.handleDelete
);

export default commentRouter;
