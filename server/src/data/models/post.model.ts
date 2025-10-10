import { OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../db";

interface Post extends RowDataPacket {
  id: number;
  title: string;
  content: string;
  created_at?: Date;
}

// A class to group our post-related functions
export class PostModel {
  /**
   * Retrieves all posts from the database.
   * @returns A promise that resolves to an array of posts.
   */
  static async getAll(): Promise<Post[]> {
    const sql = `SELECT * FROM posts`;

    try {
      const [rows] = await pool.query<Post[]>(sql);

      return rows;
    } catch (error) {
      console.error("Error fetching posts:", error);

      throw new Error("Could not fetch posts.");
    }
  }

  /**
   * Creates a new post in the database.
   * @param newPost An object containing the title and content for the new post.
   * @returns A promise that resolves to the ID of the newly created post.
   */
  static async create(newPost: {
    title: string;
    content: string;
  }): Promise<number> {
    const { title, content } = newPost;

    const sql = `INSERT INTO posts (title, content) VALUES (?, ?)`;
    const values = [title, content];

    try {
      const [result] = await pool.query<ResultSetHeader>(sql, values);
      return result.insertId;
    } catch (error) {
      console.error("Error creatingg post:", error);
      throw new Error("Could not create post.");
    }
  }
}
