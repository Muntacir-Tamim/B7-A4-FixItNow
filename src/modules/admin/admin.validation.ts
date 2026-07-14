import { z } from "zod";

const updateUserStatusSchema = z.object({
  status: z.enum(["ACTIVE", "BANNED"], {
    required_error: "Status is required",
    invalid_type_error: "Status must be either ACTIVE or BANNED",
  }),
});

export const adminValidation = {
  updateUserStatusSchema,
};
