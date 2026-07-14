import { z } from "zod";

const createPaymentSessionSchema = z.object({
  bookingId: z
    .string({ required_error: "Booking ID is required" })
    .uuid("Invalid booking ID"),
  provider: z.enum(["STRIPE", "SSLCOMMERZ"]).optional(),
});

export const paymentValidation = {
  createPaymentSessionSchema,
};
