import { z } from "zod";

const createProfileSchema = z.object({
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experience: z.number().int().min(0).optional(),
  location: z.string().optional(),
  profilePhoto: z.string().url("Invalid profile photo URL").optional(),
});

const updateProfileSchema = z.object({
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experience: z.number().int().min(0).optional(),
  location: z.string().optional(),
  profilePhoto: z.string().url("Invalid profile photo URL").optional(),
});

const availabilitySlotSchema = z.object({
  day: z.enum([
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ]),
  startTime: z
    .string({ required_error: "Start time is required" })
    .regex(/^\d{2}:\d{2}$/, "Start time must be in HH:MM format"),
  endTime: z
    .string({ required_error: "End time is required" })
    .regex(/^\d{2}:\d{2}$/, "End time must be in HH:MM format"),
});

const updateAvailabilitySchema = z.object({
  slots: z
    .array(availabilitySlotSchema)
    .min(1, "At least one availability slot is required"),
});

const updateBookingStatusSchema = z.object({
  status: z.enum(["ACCEPTED", "DECLINED", "IN_PROGRESS", "COMPLETED"], {
    required_error: "Status is required",
    invalid_type_error:
      "Status must be one of: ACCEPTED, DECLINED, IN_PROGRESS, COMPLETED",
  }),
});

export const technicianValidation = {
  createProfileSchema,
  updateProfileSchema,
  updateAvailabilitySchema,
  updateBookingStatusSchema,
};
