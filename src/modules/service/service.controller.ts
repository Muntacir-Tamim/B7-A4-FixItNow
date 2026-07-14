import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { serviceService } from "./service.service";

const createService = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;

    const result = await serviceService.createService(req.body, userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Service created successfully",
      data: result,
    });
  }
);

const getAllServices = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    const result = await serviceService.getAllServices(query as any);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Services retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getServiceById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { serviceId } = req.params;

    const result = await serviceService.getServiceById(serviceId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Service retrieved successfully",
      data: result,
    });
  }
);

const updateService = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { serviceId } = req.params;
    const userId = req.user?.id as string;

    const result = await serviceService.updateService(
      serviceId as string,
      req.body,
      userId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Service updated successfully",
      data: result,
    });
  }
);

const deleteService = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { serviceId } = req.params;
    const userId = req.user?.id as string;

    await serviceService.deleteService(serviceId as string, userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Service deleted successfully",
      data: null,
    });
  }
);

export const serviceController = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
