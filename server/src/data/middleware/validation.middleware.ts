import { Request, Response, NextFunction } from "express";

/**
 * A middleware factory that generates a validation middleware for a given ID parameter.
 * This prevents code duplication.
 * @param paramName The name of the URL parameter to validate (e.g., 'postId', 'commentId', 'userId').
 * @param propertyName The name of the property to attach to the request object (e.g., 'postId').
 */
export const validateId = (paramName: string, propertyName: keyof Request) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const idParam = req.params[paramName];
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ message: `Invalid ${paramName}. Must be a number` });
    }

    (req as any)[propertyName] = id;
    next();
  };
};

export const validatePostId = validateId("postId", "postId");
export const validateCommentId = validateId("postId", "postId");
export const validateUserId = validateId("postId", "postId");
