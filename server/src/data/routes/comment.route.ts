import { Router } from "express";
import { CommentController } from "../controller/comment,controller";
import { validatePostId } from "../middleware/validatepostid";

const commentRoutes = Router();

// Will I have to extract validatePostId middleware into another function?

commentRoutes.get(
  "/comments/:id",
  validatePostId,
  CommentController.handleGetAllForPosts
);
commentRoutes.post("/comments", CommentController.handleCreate);

export default commentRoutes;
