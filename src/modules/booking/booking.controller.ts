import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { bookingService } from "./booking.service";

const createBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string;

    const result = await bookingService.createBooking(req.body, customerId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Booking created successfully",
      data: result,
    });
  }
);

const getMyBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string;

    const result = await bookingService.getMyBookings(customerId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Bookings retrieved successfully",
      data: result,
    });
  }
);

const getBookingById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { bookingId } = req.params;
    const userId = req.user?.id as string;

    const result = await bookingService.getBookingById(
      bookingId as string,
      userId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Booking retrieved successfully",
      data: result,
    });
  }
);

const cancelBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { bookingId } = req.params;
    const customerId = req.user?.id as string;

    const result = await bookingService.cancelBooking(
      bookingId as string,
      customerId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Booking cancelled successfully",
      data: result,
    });
  }
);

export const bookingController = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};
