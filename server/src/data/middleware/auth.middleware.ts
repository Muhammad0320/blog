import { NextFunction, Request, Response } from "express";
import pool from "../db";
import { Post } from "../models/post.model";
import prisma from "../../db/prisma";

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

export const canModifyPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = req.postId as number;
    const loggedUserId = req.session.userId as number;
    const userRole = req.session.role;

    if (userRole === "admin") {
      return next();
    }

    const post = await prisma.posts.findUnique({
      where: { id: postId },
      select: { user_id: true },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const authorUserId = post.user_id;
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
