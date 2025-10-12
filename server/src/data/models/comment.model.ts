import { RowDataPacket } from "mysql2"
import pool from "../db"


export interface Comment extends RowDataPacket {
    id: number
    content: string
    author?: string 
    post_id: number 
    created_at: Date 
}


export class CommentModel {

    static async getAllForPost(postId: number): Promise<Comment[]> {
        const sql = `SELECT * FROM comments
                    WHERE post_id = ?`
        try {
            const [rows] = await pool.query<Comment[]>(sql, [postId])
            return rows
        } catch (error) {
            console.error("Error fetching comment for post: ", error);
            throw new Error("Could not fetch post")
        }

    }

}