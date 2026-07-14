import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { authController } from "./auth.controller";
import { authValidation } from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(authValidation.registerUserSchema),
  authController.registerUser
);

router.post(
  "/login",
  validateRequest(authValidation.loginUserSchema),
  authController.loginUser
);

router.post("/refresh-token", authController.refreshToken);

router.get(
  "/me",
  auth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN),
  authController.getMe
);

export const authRoutes = router;
