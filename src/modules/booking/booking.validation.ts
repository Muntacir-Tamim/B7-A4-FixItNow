import { z } from "zod";

const createBookingSchema = z.object({
  serviceId: z
    .string({ required_error: "Service ID is required" })
    .uuid("Invalid service ID"),
  scheduledDate: z
    .string({ required_error: "Scheduled date is required" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format. Use ISO 8601 format (e.g. 2025-08-15)",
    }),
  scheduledTime: z
    .string({ required_error: "Scheduled time is required" })
    .regex(/^\d{2}:\d{2}$/, "Scheduled time must be in HH:MM format"),
  address: z
    .string({ required_error: "Address is required" })
    .min(5, "Address must be at least 5 characters"),
  note: z.string().optional(),
});

export const bookingValidation = {
  createBookingSchema,
};
