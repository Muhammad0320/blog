import { Router } from "express";
import { PostController } from "../controller/post.controllers";

const postRoutes = Router();

postRoutes.get("/posts", PostController.handleGetAllPosts);
postRoutes.post("/posts", PostController.handleCreatePost);

export default postRoutes;
