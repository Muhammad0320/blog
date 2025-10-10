import { PostModel } from "../models/post.model";
import { Request, Response } from "express";

// This class will handle all the logic for incoming requests related to posts.
export class PostController {
  /**
   * Handles the request to get all posts.
   */
  static async handleGetAllPosts(req: Request, res: Response) {
    try {
      const posts = await PostModel.getAll();

      res.status(200).json(posts);
    } catch (error) {
      console.error("Controller Error: Could not fer posts", error);
      res.status(500).json({ message: "Error fetching posts" });
    }
  }

  static async handleCreatePost(req: Request, res: Response) {
    try {
      const { title, content } = req.body;

      if (!title || !content) {
        res.status(400).json({ message: "Title and Content are required" });
      }

      const postId = await PostModel.create({ title, content });
      res.status(201).json({ message: "Post created successfully", postId });
    } catch (error) {
      console.error("Controller Error: could not create post", error);
      res.status(500).json({ message: "error creating post" });
    }
  }
}
