import { z } from "zod";

const createServiceSchema = z.object({
  title: z
    .string({ required_error: "Service title is required" })
    .min(3, "Title must be at least 3 characters")
    .max(255, "Title must not exceed 255 characters"),
  description: z
    .string({ required_error: "Description is required" })
    .min(10, "Description must be at least 10 characters"),
  price: z
    .number({ required_error: "Price is required" })
    .positive("Price must be a positive number"),
  location: z.string().optional(),
  categoryId: z.string({ required_error: "Category ID is required" }).uuid("Invalid category ID"),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

const updateServiceSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  description: z.string().min(10).optional(),
  price: z.number().positive().optional(),
  location: z.string().optional(),
  categoryId: z.string().uuid("Invalid category ID").optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const serviceValidation = {
  createServiceSchema,
  updateServiceSchema,
};
