import { Request, Response, NextFunction } from "express";

// A custom interface to add our 'postId' property to the Request object
export interface RequestWithPostId extends Request {
  postId?: number;
}

/**
 * Middleware to validate the post ID from the URL parameters.
 */
export const validatePostId = (
  req: RequestWithPostId,
  res: Response,
  next: NextFunction
) => {
  // We'll use req.params.postId now to be more descriptive
  const { postId } = req.params;
  const id = parseInt(postId, 10);

  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: "Invalid post ID. Must be a number." });
  }

  req.postId = id;
  next();
};
