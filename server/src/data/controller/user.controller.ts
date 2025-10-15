import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { report } from "process";

export class UserController {
  static async handleCreate(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      // I think it high time to have a validator library instead of doing this manually!
      if (!username || !email || !password) {
        res.status(400).json({ message: "All input fields are required" });
        return;
      }

      const userId = await UserModel.create({ username, email, password });
      res
        .status(201)
        .json({ user_id: userId, message: "User successfully created" });
    } catch (error) {
      console.error("Contoller error: cannot create user", error);

      res.status(500).json({ message: "Error creating user" });
    }
  }
}
