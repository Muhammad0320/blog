import { Router, Request, Response, NextFunction } from "express";
import { PostController } from "../controller/post.controllers";

const postRoutes = Router();

interface RequestWithPostId extends Request {
  postId?: number;
}
/**
 * Middleware to validate the post ID from the URL parameters.
 */
const validatePostId = (
  req: RequestWithPostId,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const postId = parseInt(id, 10);

  if (isNaN(postId)) {
    return res
      .status(400)
      .json({ message: "Invalid post ID. Must be a number" });
  }

  req.postId = postId;

  next();
};

postRoutes.get("/posts", PostController.handleGetAllPosts);
postRoutes.post("/posts", PostController.handleCreatePost);

postRoutes.get("/posts/:id", validatePostId, PostController.handleGetPostById);
postRoutes.patch("/posts/:id", validatePostId, PostController.handleUpdatePost);
postRoutes.delete(
  "/posts/:id",
  validatePostId,
  PostController.handleDeletePost
);

export default postRoutes;
