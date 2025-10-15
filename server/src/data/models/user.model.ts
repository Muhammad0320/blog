import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../db";

export interface User extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  password: string; // I think it will be in bytes or hex when hashes
  created_at: Date;
}

interface UserData {
  username: string;
  email: string;
  password: string;
}

export type PublicUser = Omit<User, "password">;

export class UserModel {
  static async create({
    username,
    email,
    password,
  }: UserData): Promise<number> {
    // Unarguably the code here should be the longest, I also have another question; I think it will be good to have the user's first and lastname! and what i'm doing with the password here is egregious because it has not been encrypted, I'll probably need a library to hash it
    // I'll also have to check if email or username are already chosen
    const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;

    try {
      const values = [username, email, password];
      const [result] = await pool.query<ResultSetHeader>(sql, values);

      return result.insertId;
    } catch (error) {
      console.error("Error creating user", error);
      throw new Error("Cannot create user");
    }
  }
}
