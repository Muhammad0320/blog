import "express";
import "express-session";

declare module "express-serve-static-core" {
  interface Request {
    commentId?: number;
    postId?: number;
    userId?: number;
  }
}

declare module "express-session" {
  interface SessionData {
    userId?: number;
    role?: "user" | "admin";
  }
}
