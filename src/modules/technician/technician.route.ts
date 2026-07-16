import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { technicianController } from "./technician.controller";
import { technicianValidation } from "./technician.validation";

const router = Router();

// Public routes
router.get("/", technicianController.getAllTechnicians);

router.get(
  "/bookings",
  auth(Role.TECHNICIAN),
  technicianController.getTechnicianBookings,
);

// Technician-only routes
router.post(
  "/profile",
  auth(Role.TECHNICIAN),
  validateRequest(technicianValidation.createProfileSchema),
  technicianController.createProfile,
);

router.put(
  "/profile",
  auth(Role.TECHNICIAN),
  validateRequest(technicianValidation.updateProfileSchema),
  technicianController.updateProfile,
);

router.put(
  "/availability",
  auth(Role.TECHNICIAN),
  validateRequest(technicianValidation.updateAvailabilitySchema),
  technicianController.updateAvailability,
);

router.patch(
  "/bookings/:bookingId",
  auth(Role.TECHNICIAN),
  validateRequest(technicianValidation.updateBookingStatusSchema),
  technicianController.updateBookingStatus,
);

router.get("/:technicianId", technicianController.getTechnicianById);

export const technicianRoutes = router;
