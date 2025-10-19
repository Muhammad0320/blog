import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../db";
import { posts as Post } from "../../generated/prisma";
import prisma from "../../db/prisma";

export { Post };

// A class to group our post-related functions
export class PostModel {
  /**
   * Retrieves all posts from the database.
   * @returns A promise that resolves to an array of posts.
   */
  static async getAll(): Promise<Post[]> {
    return prisma.posts.findMany();
  }

  /**
   * Creates a new post in the database.
   * @param newPost An object containing the title and content for the new post.
   * @returns A promise that resolves to the ID of the newly created post.
   */
  static async create(data: {
    title: string;
    content: string;
    userId: number;
  }): Promise<Post> {
    const { title, content, userId } = data;
    return prisma.posts.create({
      data: { title, content, users: { connect: { id: userId } } },
    });
  }

  static async getById(id: number): Promise<Post | null> {
    return prisma.posts.findUnique({ where: { id } });
  }

  static async delete(id: number): Promise<Post> {
    return prisma.posts.delete({
      where: { id },
    });
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
  ): Promise<Post> {
    const { title, content } = data;

    return prisma.posts.update({
      where: { id },
      data: { title, content },
    });
  }
}
