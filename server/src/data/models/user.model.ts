import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../db";
import { z } from "zod";
import { userCreateSchema } from "../../lib/validators";
import { Password } from "../../lib/auth";

export interface User extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  password: string; // I think it will be in bytes or hex when hashes
  created_at: Date;
  role: "user" | "admin";
}

export type PublicUser = Omit<User, "password">;

type UserData = z.infer<typeof userCreateSchema>;

export type UserProfileInfo = {
  id: number;
  username: string;
  created_at: Date;
};

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
    const hashedPassword = await Password.hash(password);

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

  static async findByEmail(email: string): Promise<User | null> {
    const sql = `SELECT * FROM users WHERE email = ?`;
    try {
      const [rows] = await pool.query<User[]>(sql, [email]);

      return rows[0] || null;
    } catch (error) {
      console.error("DB Error: could not find user with such email", email);
      throw new Error("Error finding user");
    }
  }

  static async findPublicProfileById(
    id: number
  ): Promise<UserProfileInfo | null> {
    const sql = `SELECT id, username, created_at FROM users WHERE id = ?`;

    try {
      const [rows] = await pool.query<(UserProfileInfo & RowDataPacket)[]>(
        sql,
        [id]
      );

      return rows[0] || null;
    } catch (error) {
      console.error("DB error: could not find user with such id ", error);
      throw new Error("Error finding user profile");
    }
  }
}
