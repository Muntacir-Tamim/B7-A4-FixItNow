import { z } from "zod";

const createCategorySchema = z.object({
  name: z
    .string({ required_error: "Category name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name must not exceed 255 characters"),
  description: z.string().optional(),
  icon: z.string().optional(),
});

const updateCategorySchema = z.object({
  name: z.string().min(2).max(255).optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
});

export const categoryValidation = {
  createCategorySchema,
  updateCategorySchema,
};
