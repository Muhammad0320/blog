import { Router } from "express";
import { validateCommentId } from "../middleware/validation.middleware";
import { CommentController } from "../controller/comment.controller";

const commentRouter = Router();

commentRouter.get(
  "/posts/:postId/comments",
  validateCommentId,
  CommentController.handleGetAllForPosts
);
commentRouter.post(
  "/posts/:postId/comments",
  validateCommentId,
  CommentController.handleCreate
);

commentRouter.delete(
  "/comments/:commentId",
  validateCommentId,
  CommentController.handleDelete
);

commentRouter.patch(
  "/comments/:commentId",
  validateCommentId,
  CommentController.handleUpdate
);

export default commentRouter;
