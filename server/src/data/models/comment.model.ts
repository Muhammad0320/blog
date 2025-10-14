import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../db";

export interface Comment extends RowDataPacket {
  id: number;
  content: string;
  author?: string;
  post_id: number;
  created_at: Date;
}

interface NewCommentData {
  content: string;
  postId: number;
  author?: string;
}

export class CommentModel {
  static async getAllForPost(postId: number): Promise<Comment[]> {
    const sql = `SELECT * FROM comments
                    WHERE post_id = ?`;
    try {
      const [rows] = await pool.query<Comment[]>(sql, [postId]);
      return rows;
    } catch (error) {
      console.error("Error fetching comment for post: ", error);
      throw new Error("Could not fetch post");
    }
  }

  static async create(data: NewCommentData): Promise<number> {
    const { content, postId, author } = data;

    const sql = `
        INSERT INTO comments (content, author, post_id) VALUES (?, ?, ?)
        `;
    const values = [content, author || null, postId];

    try {
      const [result] = await pool.query<ResultSetHeader>(sql, values);

      return result.insertId;
    } catch (error: unknown) {
      console.error("Error Creating comment: ", error);

      if (error && typeof error === "object" && "code" in error) {
        if (error.code === "ER_NO_REFERENCED_ROW_2")
          throw new Error(
            "Could not create comment. The specified post does not exist"
          );
      }
      throw new Error("Could not create comment");
    }
  }

  static async delete(id: number): Promise<Number> {
    const sql = `DELETE FROM comments WHERE id = ? `;

    try {
      const [results] = await pool.query<ResultSetHeader>(sql, [id]);
      return results.affectedRows;
    } catch (error) {
      console.error("Error dleting comment", error);
      throw new Error("Could not delete comment");
    }
  }
}
