import { Router } from "express";
import { validateId } from "../middleware/validation.middleware";
import { CommentController } from "../controller/comment.controller";

const commentRouter = Router();

commentRouter.get(
  "/posts/:id/comments",
  validateId,
  CommentController.handleGetAllForPosts
);
commentRouter.post(
  "/posts/:id/comments",
  validateId,
  CommentController.handleCreate
);

commentRouter.delete(
  "/comments/:id",
  validateId,
  CommentController.handleDelete
);

export default commentRouter;
