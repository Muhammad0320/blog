import { NextFunction, Request, Response } from "express";
import pool from "../db";
import { Post } from "../models/post.model";

export const isAuthenicated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session && req.session.userId) {
    next();
    return;
  }

  res.status(401).json({
    message: "Unauthorized: You must be logged in to access this resource",
  });
};

export const isPostOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedUserId = req.session.userId as number;
    const postId = req.postId as number;

    const sql = `SELECT user_id FROM posts WHERE id = ?`;
    const [rows] = await pool.query<Post[]>(sql, [postId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Post not found!" });
    }

    const authorUserId = rows[0].userId;

    if (authorUserId !== loggedUserId) {
      return res.status(403).json({
        message: "Forbidden: You're not permitted to perform this action!",
      });
    }

    return next();
  } catch (error) {
    console.error("Authorization error:", error);
    res.status(500).json({ message: "Error checking post ownership!" });
    return;
  }
};
