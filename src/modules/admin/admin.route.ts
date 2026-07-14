import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { categoryController } from "../category/category.controller";
import { categoryValidation } from "../category/category.validation";
import { adminController } from "./admin.controller";
import { adminValidation } from "./admin.validation";

const router = Router();

router.get("/stats", auth(Role.ADMIN), adminController.getDashboardStats);

router.get("/users", auth(Role.ADMIN), adminController.getAllUsers);

router.patch(
  "/users/:userId",
  auth(Role.ADMIN),
  validateRequest(adminValidation.updateUserStatusSchema),
  adminController.updateUserStatus
);

router.get("/bookings", auth(Role.ADMIN), adminController.getAllBookings);

router.get("/categories", auth(Role.ADMIN), categoryController.getAllCategories);

router.post(
  "/categories",
  auth(Role.ADMIN),
  validateRequest(categoryValidation.createCategorySchema),
  categoryController.createCategory
);

router.patch(
  "/categories/:categoryId",
  auth(Role.ADMIN),
  validateRequest(categoryValidation.updateCategorySchema),
  categoryController.updateCategory
);

router.delete(
  "/categories/:categoryId",
  auth(Role.ADMIN),
  categoryController.deleteCategory
);

export const adminRoutes = router;
