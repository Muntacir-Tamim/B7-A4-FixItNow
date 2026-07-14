import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

const createPaymentSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string;

    const result = await paymentService.createPaymentSession(
      req.body,
      customerId,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment session created successfully",
      data: result,
    });
  },
);

// const handleWebhook = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const event = req.body as Buffer;
//     const signature = req.headers["stripe-signature"]!;

//     await paymentService.handleWebhook(event, signature as string);

//     sendResponse(res, {
//       success: true,
//       statusCode: 200,
//       message: "Webhook handled successfully",
//       data: null,
//     });
//   }
// );

const handleWebhook = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;

  if (!signature) {
    return res.status(400).json({ error: "Missing stripe-signature header" });
  }

  if (!Buffer.isBuffer(req.body)) {
    console.error("Body is not a Buffer:", typeof req.body);
    return res.status(400).json({ error: "Body must be raw buffer" });
  }

  try {
    await paymentService.handleWebhook(req.body, signature);
    return res.status(200).json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return res.status(400).json({ error: err.message });
  }
};

const getMyPayments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string;

    const result = await paymentService.getMyPayments(customerId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment history retrieved successfully",
      data: result,
    });
  },
);

const getPaymentById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { paymentId } = req.params;
    const userId = req.user?.id as string;

    const result = await paymentService.getPaymentById(
      paymentId as string,
      userId,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment details retrieved successfully",
      data: result,
    });
  },
);

export const paymentController = {
  createPaymentSession,
  handleWebhook,
  getMyPayments,
  getPaymentById,
};
