import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../db";
import { comments as Comment } from "../../generated/prisma";
import prisma from "../../db/prisma";

export { Comment };

interface NewCommentData {
  content: string;
  postId: number;
  userId?: number;
}

export class CommentModel {
  static async getAllForPost(postId: number): Promise<Comment[]> {
    return prisma.comments.findMany({
      where: { post_id: postId },
      include: { author: { select: { id: true, username: true } } },
    });
  }

  static async create(data: NewCommentData): Promise<Comment> {
    const { content, postId, userId } = data;

    return prisma.comments.create({
      data: {
        content,
        author: { connect: { id: userId } },
        posts: {
          connect: { id: postId },
        },
      },
    });
  }

  static async delete(id: number): Promise<Comment> {
    return prisma.comments.delete({ where: { id } });
  }

  static async update(
    id: number,
    { content }: { content: string }
  ): Promise<Comment> {
    return prisma.comments.update({ where: { id }, data: { content } });
  }
}
