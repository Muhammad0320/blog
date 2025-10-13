import { Router } from "express";
import { CommentController } from "../controller/comment,controller";
import { validatePostId } from "../middleware/validation.middleware";

const commentRouter = Router();

commentRouter.get(
  "/comments/:id",
  validatePostId,
  CommentController.handleGetAllForPosts
);
commentRouter.post("/comments", CommentController.handleCreate);

export default commentRouter;
