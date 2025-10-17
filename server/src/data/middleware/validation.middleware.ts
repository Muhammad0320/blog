import { Request, Response, NextFunction } from "express";

export const validateId = (paramName: string, propertyName: keyof Request) => {

  return (req: Request, res: Response, next: NextFunction) => {

    const idParam = req.params[paramName]
    const id = parseInt(idParam, 10)
    if (isNaN(id)) {
      return res.status(400).json({message: `Invalid ${paramName}. Must be a number`})
    }

    (req as any)[propertyName] = id 
    next()
  }
}

export const validatePostId = validateId("postId", "postId")
export const validateCommentId = validateId("postId", "postId")
export const validateUserId = validateId("postId", "postId")