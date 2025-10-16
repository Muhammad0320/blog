import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { userCreateSchema, userLoginSchema } from "../../lib/validators";
import z, { ZodError } from "zod";
import { Password } from "../../lib/auth";

export class UserController {
  static async handleCreate(req: Request, res: Response) {
    try {
      const userData = userCreateSchema.parse(req.body);
      const userId = await UserModel.create(userData);
      res.status(201).json({ userId, message: "User successfully created" });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
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

  static async handleLogin(req: Request, res: Response) {
    try {
      const { email, password } = userLoginSchema.parse(req.body);

      const existingUser = await UserModel.findByEmail(email);
      if (!existingUser) {
        // I think it's error 401 / 403
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      if (!Password.compare(password, existingUser.password)) {
        // I think it's error 401 / 403, Also
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      // I should add login for adding session cookie stuff here, probably adding a new prop to the Request interface in the express.d.ts file, so that it will be easy for me to check if a specific user is logged in or I can even add a middleware to do that
      res.status(200).json({ message: "Login Successful", data: existingUser });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: "Invalid input",
          errors: z.treeifyError(error).errors,
        });
        return;
      }

      console.error("Controller error: Could not login user", error);
      res.status(500).json({ message: "Error logging in user" });
    }
  }
}
