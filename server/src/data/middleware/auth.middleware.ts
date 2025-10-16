import { NextFunction, Request, Response } from "express";

export const isAuthenicated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session && req.session.userId) {
    next();
    return;
  }

  res
    .status(401)
    .json({
      message: "Unauthorized: You must be logged in to access this resource",
    });
};
