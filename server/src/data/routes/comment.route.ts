import { Router } from "express";
import { validatePostId } from "../middleware/validation.middleware";
import { CommentController } from "../controller/comment.controller";

const commentRouter = Router();

commentRouter.get(
  "/posts/:id/comments",
  validatePostId,
  CommentController.handleGetAllForPosts
);
commentRouter.post(
  "/posts/:id/comments",
  validatePostId,
  CommentController.handleCreate
);

export default commentRouter;
