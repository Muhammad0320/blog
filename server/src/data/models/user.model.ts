import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { userCreateSchema } from "../../lib/validators";

export interface User extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  password: string; // I think it will be in bytes or hex when hashes
  created_at: Date;
}

export type PublicUser = Omit<User, "password">;

type UserData = z.infer<typeof userCreateSchema>;

export class UserModel {
  static async create({
    username,
    email,
    password,
  }: UserData): Promise<number> {
    // Check for duplicate username/email
    const checkSql = `SELECT id FROM users WHERE username = ? OR email = ?`;
    const [existingUser] = await pool.query<User[]>(checkSql, [
      username,
      email,
    ]);

    if (existingUser.length > 0) {
      throw new Error("Username or email already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertSql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    const values = [username, email, hashedPassword];
    try {
      const [result] = await pool.query<ResultSetHeader>(insertSql, values);

      return result.insertId;
    } catch (error) {
      console.error("Error creating user", error);
      throw new Error("Cannot create user");
    }
  }
}
