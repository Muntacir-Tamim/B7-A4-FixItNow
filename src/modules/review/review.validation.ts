import { z } from "zod";

const createReviewSchema = z.object({
  bookingId: z
    .string({ required_error: "Booking ID is required" })
    .uuid("Invalid booking ID"),
  rating: z
    .number({ required_error: "Rating is required" })
    .int("Rating must be an integer")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must not exceed 5"),
  comment: z
    .string({ required_error: "Comment is required" })
    .min(5, "Comment must be at least 5 characters"),
});

export const reviewValidation = {
  createReviewSchema,
};
