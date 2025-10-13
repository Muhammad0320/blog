import { Router } from "express";
import { validatePostId } from "../middleware/validation.middleware";
import { CommentController } from "../controller/comment.controller";

const commentRouter = Router();

commentRouter.get(
  "/comments/:id",
  validatePostId,
  CommentController.handleGetAllForPosts
);
commentRouter.post("/comments", CommentController.handleCreate);

export default commentRouter;
