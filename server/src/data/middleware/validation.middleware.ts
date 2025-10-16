import { Request, Response, NextFunction } from "express";

export const validatePostId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

/**
 * NEW: Middleware to validate the comment ID from the URL parameters.
 */
export const validateCommentId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // We look for 'commentId' in the URL
  const { commentId } = req.params;
  const id = parseInt(commentId, 10);

  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: "Invalid comment ID. Must be a number." });
  }

  // We attach it to the request as 'req.commentId'
  req.commentId = id;
  next();
};

export const validateUserId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // We look for 'commentId' in the URL
  const { userId } = req.params;
  const id = parseInt(userId, 10);

  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: "Invalid user ID. Must be a number." });
  }

  // We attach it to the request as 'req.userId'
  req.userId = id;
  next();
};
