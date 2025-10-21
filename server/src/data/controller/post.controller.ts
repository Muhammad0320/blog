import { Prisma } from "../../generated/prisma";
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

      const userId = req.session.userId as number;

      console.log("----------- Post Controller", { title, content, userId });
      if (!title || !content) {
        res.status(400).json({ message: "Title and Content are required" });
      }

      const post = await PostModel.create({ title, content, userId });
      res
        .status(201)
        .json({ message: "Post created successfully", postId: post.id });
    } catch (error) {
      console.error("Controller Error: could not create post", error);
      res.status(500).json({ message: "error creating post" });
    }
  }

  static async handleGetPostById(req: Request, res: Response) {
    try {
      const postId = req.postId as number;

      const post = await PostModel.getById(postId);

      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    } catch (error) {
      console.error("Cannot fetch post:", error);
      res.status(500).json({ message: "Cannot fetch post" });
    }
  }

  static async handleDeletePost(req: Request, res: Response) {
    try {
      const postId = req.postId as number;

      await PostModel.delete(postId);

      return res.status(204).send();
    } catch (error) {
      // This is the key part. We check for Prisma's specific "Record not found" error code.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return res.status(404).json({ message: "Post not found." });
      }

      console.error("Cannot delete post", error);
      res.status(500).json({ message: "Error deleting post" });
    }
  }

  static async handleUpdatePost(req: Request, res: Response) {
    try {
      const postId = req.postId as number;
      const { title, content } = req.body;

      const updatedPost = await PostModel.update(postId, { title, content });
      res.status(200).json(updatedPost);
    } catch (error) {
      // This is the key part. We check for Prisma's specific "Record not found" error code.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return res.status(404).json({ message: "Post not found." });
      }

      console.error("Cannot update post", error);
      res.status(500).json({ message: "Eror deleting post" });
    }
  }
}
