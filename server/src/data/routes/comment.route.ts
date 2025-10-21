import { Router } from "express";
import { validateCommentId } from "../middleware/validation.middleware";
import { CommentController } from "../controller/comment.controller";
import { apiLimiter } from "./post.route";

const commentRouter = Router();

commentRouter.get(
  "/posts/:postId/comments",
  validateCommentId,
  CommentController.handleGetAllForPosts
);
commentRouter.post(
  "/posts/:postId/comments",
  validateCommentId,
  apiLimiter,
  CommentController.handleCreate
);

commentRouter.delete(
  "/comments/:commentId",
  validateCommentId,
  apiLimiter,
  CommentController.handleDelete
);

commentRouter.patch(
  "/comments/:commentId",
  validateCommentId,
  apiLimiter,
  CommentController.handleUpdate
);

export default commentRouter;
