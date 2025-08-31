import { z } from "zod";

export const articleSchema = z.object({
    title: z.string().min(1, "Title is required"),
    excerpt: z.string().min(1, "Excerpt is required"),
    content: z.string().min(1, "Content is required"),
    categories: z.array(z.string()).min(1, "At least one category is required"),
    status: z.enum(["Draft", "Published", "Scheduled"]),
    publishDate: z.string().min(1, "Publish date required"),
    tags: z.array(z.string()).optional(),
    featuredImage: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional()
});