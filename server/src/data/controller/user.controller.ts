import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { createUserSchema } from "../../lib/validators";
import z, { ZodError } from "zod";

export class UserController {
  static async handleCreate(req: Request, res: Response) {
    try {
      const userData = createUserSchema.parse(req.body);
      const userId = await UserModel.create(userData);
      res.status(201).json({ userId, message: "User successfully created" });
    } catch (error) {
      if (error instanceof ZodError) {
        res
          .status(400)
          .json({
            message: "Invalid input",
            errors: z.treeifyError(error).errors,
          });
        return;
      }

      if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof error.message == "string"
      ) {
        if (error.message.includes("already exists")) {
          return res.status(409).json({ message: error.message });
        }
      }

      console.error("Controller error: Could not create user", error);
      res.status(500).json({ message: "Error creating user" });
    }
  }
}
