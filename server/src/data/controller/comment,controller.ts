import { Request, Response } from "express";
import { CommentModel } from "../models/comment.model";

export class CommentController {
  static async handleGetAllForPosts(req: Request, res: Response) {
    try {
      const postId = req.postId as number;

      const comments = await CommentModel.getAllForPost(postId);

      res.status(200).json(comments);
    } catch (error) {
      console.error("Controller error: Could not get commets for post", error);
      res.status(500).json({ message: "Error fetching comments" });
    }
  }

  static async handleCreate(req: Request, res: Response) {
    try {
      const postId = req.postId as number;
      const { content, author } = req.body;
      
      if (!content) {
        res.status(400).json({ message: "The 'content' field is required " });
      }

      const newCommentId = await CommentModel.create({
        content,
        postId,
        author,
      });

      res.json(201).json({
        message: "Comment successfully created!",
        commentId: newCommentId,
      });
    } catch (error) {
      console.error("Contoller error: Could not create comment", error);

      if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        if (error.message?.includes("post does not exist")) {
          return res
            .status(404)
            .json({
              message: "Cannot create comment for a post that does not exist",
            });
        }
      }

      res.status(500).json({ mesage: "Error creating comment" });
    }
  }
}
