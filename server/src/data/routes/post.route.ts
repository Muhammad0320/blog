import { Router } from "express";
import { PostController } from "../controller/post.controllers";

const postRoutes = Router();

postRoutes.get("/posts", PostController.handleGetAllPosts);
postRoutes.post("/posts", PostController.handleCreatePost);
postRoutes.get("/posts/:id", PostController.handleGetPostById);

export default postRoutes;
