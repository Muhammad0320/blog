import z from "zod";

export const userCreateSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.email("Please provide a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),

  firstName: z
    .string()
    .min(2, "Firstname must be at least 2 characters long")
    .optional(),
  lastName: z
    .string()
    .min(2, "Lastname must be at least 2 characters long")
    .optional(),
});

export const userLoginSchema = z.object({
  email: z.email("Please provide a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const commentCreateSchema = z.object({
  content: z.string().min(1, "Comment content cannot be empty."),
});
