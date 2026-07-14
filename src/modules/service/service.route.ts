import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { serviceController } from "./service.controller";
import { serviceValidation } from "./service.validation";

const router = Router();

router.get("/", serviceController.getAllServices);

router.get("/:serviceId", serviceController.getServiceById);

router.post(
  "/",
  auth(Role.TECHNICIAN),
  validateRequest(serviceValidation.createServiceSchema),
  serviceController.createService
);

router.patch(
  "/:serviceId",
  auth(Role.TECHNICIAN),
  validateRequest(serviceValidation.updateServiceSchema),
  serviceController.updateService
);

router.delete(
  "/:serviceId",
  auth(Role.TECHNICIAN, Role.ADMIN),
  serviceController.deleteService
);

export const serviceRoutes = router;
