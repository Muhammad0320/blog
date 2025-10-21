import { z } from "zod";
import { userCreateSchema } from "../../lib/validators";
import { Password } from "../../lib/auth";
import { users as User } from "../../generated/prisma";
import prisma from "../../db/prisma";

export { User };

export type PublicUser = Omit<User, "password">;

export type UserData = z.infer<typeof userCreateSchema>;

export type UserProfileInfo = {
  id: number;
  username: string;
  created_at: Date;
  firstName?: string;
  lastName?: string;
};

export class UserModel {
  static async create({
    username,
    email,
    password,
    firstName,
    lastName,
  }: UserData): Promise<User> {
    const existingUser = await prisma.users.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (existingUser) {
      throw new Error("Username or email already exists");
    }

    const hashedPassword = await Password.hash(password);

    return prisma.users.create({
      data: { username, email, password: hashedPassword, firstName, lastName },
    });
  }

  static async findByEmail(email: string): Promise<User | null> {
    return prisma.users.findUnique({ where: { email } });
  }

  static async findPublicProfileById(
    id: number
  ): Promise<UserProfileInfo | null> {
    return prisma.users.findUnique({
      where: { id },
      select: { id: true, username: true, created_at: true },
    });
  }
}
