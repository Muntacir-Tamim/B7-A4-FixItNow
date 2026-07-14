import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { categoryController } from "./category.controller";
import { categoryValidation } from "./category.validation";

const router = Router();

router.get("/", categoryController.getAllCategories);

router.get("/:categoryId", categoryController.getCategoryById);

router.post(
  "/",
  auth(Role.ADMIN),
  validateRequest(categoryValidation.createCategorySchema),
  categoryController.createCategory
);

router.patch(
  "/:categoryId",
  auth(Role.ADMIN),
  validateRequest(categoryValidation.updateCategorySchema),
  categoryController.updateCategory
);

router.delete(
  "/:categoryId",
  auth(Role.ADMIN),
  categoryController.deleteCategory
);

export const categoryRoutes = router;
