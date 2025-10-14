import { Router } from "express";
import { validateId } from "../middleware/validation.middleware";
import { PostController } from "../controller/post.controller";

const postRoutes = Router();

postRoutes.get("/posts", PostController.handleGetAllPosts);
postRoutes.post("/posts", PostController.handleCreatePost);

postRoutes.get("/posts/:id", validateId, PostController.handleGetPostById);
postRoutes.patch("/posts/:id", validateId, PostController.handleUpdatePost);
postRoutes.delete("/posts/:id", validateId, PostController.handleDeletePost);

export default postRoutes;
