import z from "zod";

export const createUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.email("Please provide a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
