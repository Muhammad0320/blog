import { Response, NextFunction, Request } from "express";

/**
 * Middleware to validate the post ID from the URL parameters.
 */
export const validatePostId = (
  req: Request,
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
