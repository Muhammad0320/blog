import z, { ZodError } from "zod";
import { Password } from "../../lib/auth";
import { Request, Response } from "express";
import { PublicUser, UserModel } from "../models/user.model";
import { userCreateSchema, userLoginSchema } from "../../lib/validators";

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

      const user = await UserModel.findByEmail(email);
      if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      if (!(await Password.compare(password, user.password))) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      // ---- CREATE THE SESSION ----
      req.session.userId = user.id;
      req.session.role = user.role;

      const publicUser: PublicUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
      };

      res.status(200).json({ message: "Login Successful", user: publicUser });
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
      return;
    }
  }

  static async handleLogout(req: Request, res: Response) {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: "Could not logout, Please try again" });
      }

      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logout successful" });
      return;
    });
  }

  static async handlePublicProfile(req: Request, res: Response) {
    try {
      const userId = req.userId as number;

      const userProfile = await UserModel.findPublicProfileById(userId);
      if (!userProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      res.status(200).json(userProfile);
    } catch (error) {
      console.error("Contoller error: Could not get public profile");
      res.status(500).json({ message: "Error getting public profile" });
    }
  }
}
