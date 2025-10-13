import { Request, Response } from "express";
import { CommentModel } from "../models/comment.model";

interface RequestWithPostId extends Request {
  postId?: number;
}

class CommentController {
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
}
