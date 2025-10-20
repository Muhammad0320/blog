import { Request, Response } from "express";
import { CommentModel } from "../models/comment.model";
import z, { ZodError } from "zod";
import { commentCreateSchema } from "../../lib/validators";
import { Prisma } from "../../generated/prisma";

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
      const userId = req.session.userId as number;
      const { content } = commentCreateSchema.parse(req.body);

      const newComment = await CommentModel.create({
        content,
        postId,
        userId,
      });

      res.status(201).json({
        message: "Comment successfully created!",
        commentId: newComment.id,
      });
    } catch (error) {
      console.error("Contoller error: Could not create comment", error);

      if (error instanceof ZodError) {
        res.status(400).json({
          message: "Invalid input",
          errors: (z.treeifyError(error) as any)["properties"],
        });
        return;
      }

      if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        if (error.message?.includes("post does not exist")) {
          res.status(404).json({
            message: "Cannot create comment for a post that does not exist",
          });
          return;
        }
      }

      res.status(500).json({ mesage: "Error creating comment" });
    }
  }

  static async handleDelete(req: Request, res: Response) {
    try {
      const id = req.commentId as number;

      await CommentModel.delete(id);
      return res.status(204).send();
    } catch (error) {
      // This is the key part. We check for Prisma's specific "Record not found" error code.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return res.status(404).json({ message: "Post not found." });
      }

      console.error("Cannot delete comment", error);

      throw new Error("Error deleting comment");
    }
  }

  static async handleUpdate(req: Request, res: Response) {
    try {
      const id = req.commentId as number;
      const { content } = req.body;

      if (!content) {
        res.status(400).json({ message: "The 'content' field is required " });
        return;
      }

      const updatedComment = await CommentModel.update(id, { content });
      res.status(200).json(updatedComment);
    } catch (error) {
      // This is the key part. We check for Prisma's specific "Record not found" error code.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return res.status(404).json({ message: "Post not found." });
      }

      console.error("Could not update comment", error);
      throw new Error("Error updating comment");
    }
  }
}
