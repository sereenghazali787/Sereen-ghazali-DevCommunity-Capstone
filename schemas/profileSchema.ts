import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be 50 characters or less"),

  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be 30 characters or less")
    .regex(
      /^[a-z0-9_]+$/,
      "Username can only contain lowercase letters, numbers, and underscores"
    ),

  bio: z
    .string()
    .trim()
    .max(300, "Bio must be 300 characters or less"),

  githubUrl: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" ||
        /^https:\/\/github\.com\/[A-Za-z0-9-]+\/?$/.test(value),
      "Enter a valid GitHub profile URL"
    ),
});

export type ProfileInput = z.infer<
  typeof profileSchema
>;