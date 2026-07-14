import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { adminService } from "./admin.service";

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    const result = await adminService.getAllUsers(query as any);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Users retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

const updateUserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { status } = req.body;

    const result = await adminService.updateUserStatus(
      userId as string,
      status
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User status updated successfully",
      data: result,
    });
  }
);

const getAllBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    const result = await adminService.getAllBookings(query as any);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All bookings retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getDashboardStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getDashboardStats();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Dashboard stats retrieved successfully",
      data: result,
    });
  }
);

export const adminController = {
  getAllUsers,
  updateUserStatus,
  getAllBookings,
  getDashboardStats,
};
