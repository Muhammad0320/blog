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
      console.error("Error creating post:", error);
      throw new Error("Could not create post.");
    }
  }

  static async getById(id: number): Promise<Post | null> {
    const sql = `SELECT * FROM posts
            WHERE id = ?
            `;
    try {
      const [rows] = await pool.query<Post[]>(sql, [id]);

      return rows[0] || null;
    } catch (error) {
      console.error(`Error fetching post with id ${id}:`, error);
      throw new Error("Could not fetch post!");
    }
  }

  static async delete(id: number): Promise<number> {
    const sql = `DELETE FROM posts 
                  WHERE id = ?
                  `;
    try {
      const [result] = await pool.query<ResultSetHeader>(sql, [id]);

      return result.affectedRows;
    } catch (error) {
      console.error("Error deleting post", error);
      throw new Error("Could not delete post");
    }
  }

  /**
   * Updates a post with new data.
   * @param id The ID of the post to update.
   * @param data An object containing the new title and/or content.
   * @returns A promise that resolves to the number of affected rows.
   */
  static async update(
    id: number,
    data: { title?: string; content?: string }
  ): Promise<number> {
    const { title, content } = data;

    const setParts: string[] = [];
    const values: (string | number)[] = [];

    if (title) {
      setParts.push("title = ?");
      values.push(title);
    }
    if (content) {
      setParts.push("content = ?");
      values.push(content);
    }

    if (setParts.length === 0) {
      return 0;
    }

    const setClause = setParts.join(", ");
    values.push(id);

    const sql = `UPDATE posts SET ${setClause} WHERE id = ?`;

    try {
      const [result] = await pool.query<ResultSetHeader>(sql, values);

      return result.affectedRows;
    } catch (error) {
      console.error("Error updating post", error);
      throw new Error("Could not update post");
    }
  }
}
