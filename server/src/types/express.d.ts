import "express";

declare module "express-serve-static-core" {
  interface Request {
    commentId?: number;
    postId?: number;
  }
}
