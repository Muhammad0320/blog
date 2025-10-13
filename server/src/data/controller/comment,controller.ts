import { Request, Response } from "express";
import { CommentModel } from "../models/comment.model";
import { RequestWithPostId } from "../middleware/validation.middleware";

export class CommentController {
  static async handleGetAllForPosts(req: RequestWithPostId, res: Response) {
    try {
      const postId = req.postId as number;

      const comments = await CommentModel.getAllForPost(postId);

      res.status(200).json(comments);
    } catch (error) {
      console.error("Controller error: Error getting all comments", error);
      throw new Error("Can not get all comments");
    }
  }

  static async handleCreate(req: Request, res: Response) {
    try {
      const { content, postId, author } = req.body;

      if (!content || !postId || !author) {
        res
          .status(400)
          .json({ message: "content, postId and author field are requireed" });
      }

      const affectedRow = await CommentModel.create({
        content,
        postId,
        author,
      });
      // Is this the right way of checking for a postid not found
      if (affectedRow < 1) {
        res.status(404).json({ message: "Post id not found!" });
      }

      res.json(201).json({ message: "Comment successfully created!" });
    } catch (error) {
      console.error("Contoller error: Error creating new comment", error);
      throw new Error("Cannot create comment");
    }
  }
}
