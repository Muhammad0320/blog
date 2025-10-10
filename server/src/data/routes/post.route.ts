import { Router } from "express";
import { PostController } from "../controller/post.controllers";

const router = Router();

router.get("/posts", PostController.handleGetAllPosts);
router.post("/posts", PostController.handleCreatePost);
