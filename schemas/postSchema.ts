import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must be 150 characters or less"),

  excerpt: z
    .string()
    .min(10, "Excerpt must be at least 10 characters")
    .max(300, "Excerpt must be 300 characters or less"),

  content: z
    .string()
    .min(20, "Content must be at least 20 characters"),

  communityId: z
    .string()
    .min(1, "Please select a community"),

  topics: z
    .array(z.string())
    .min(1, "Add at least one topic")
    .max(5, "You can add up to 5 topics"),
});

export type PostInput = z.infer<typeof postSchema>;