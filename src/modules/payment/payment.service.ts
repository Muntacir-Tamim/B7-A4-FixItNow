import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { ICreatePaymentPayload } from "./payment.interface";

const createPaymentSession = async (
  payload: ICreatePaymentPayload,
  customerId: string,
) => {
  const { bookingId, provider = "STRIPE" } = payload;

  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId, customerId },
    include: {
      service: { include: { category: true } },
      technicianProfile: {
        include: { user: { omit: { password: true } } },
      },
      customer: { omit: { password: true } },
    },
  });

  if (booking.status !== "ACCEPTED") {
    throw new Error(
      "Payment can only be made for bookings with ACCEPTED status",
    );
  }

  const existingPayment = await prisma.payment.findUnique({
    where: { bookingId },
  });

  if (existingPayment && existingPayment.status === "COMPLETED") {
    throw new Error("This booking has already been paid");
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: booking.service.title,
            description: `Booking for ${booking.service.title} on ${booking.scheduledDate.toDateString()}`,
          },
          unit_amount: Math.round(booking.totalAmount * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    payment_method_types: ["card"],
    success_url: `${config.app_url}/payment/success?bookingId=${bookingId}`,
    cancel_url: `${config.app_url}/payment/cancel?bookingId=${bookingId}`,
    metadata: {
      bookingId,
      customerId,
    },
  });

  await prisma.payment.upsert({
    where: { bookingId },
    create: {
      bookingId,
      amount: booking.totalAmount,
      provider: "STRIPE",
      status: "PENDING",
      stripeSessionId: session.id,
    },
    update: {
      stripeSessionId: session.id,
      status: "PENDING",
    },
  });

  return {
    paymentUrl: session.url,
    sessionId: session.id,
  };
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_webhook_secret;
  console.log("Webhook received");
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );

  console.log("Event Type:", event.type);

  switch (event.type) {
    case "checkout.session.completed":
      console.log("Checkout Completed");
      await handleCheckoutCompleted(event.data.object);
      break;
    case "payment_intent.payment_failed":
      console.log("Payment Failed");
      await handlePaymentFailed(event.data.object);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
      break;
  }
};

const handleCheckoutCompleted = async (session: Stripe.Checkout.Session) => {
  const bookingId = session.metadata?.bookingId;

  if (!bookingId) {
    console.log("Webhook: Missing bookingId in session metadata");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { bookingId },
      data: {
        status: "COMPLETED",
        transactionId: session.payment_intent as string,
        paidAt: new Date(),
        method: "card",
      },
    });

    await tx.booking.update({
      where: { id: bookingId },
      data: { status: "PAID" },
    });
  });
};

const handlePaymentFailed = async (paymentIntent: Stripe.PaymentIntent) => {
  const payment = await prisma.payment.findFirst({
    where: { transactionId: paymentIntent.id },
  });

  if (!payment) return;

  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "FAILED" },
  });
};

const getMyPayments = async (customerId: string) => {
  const bookings = await prisma.booking.findMany({
    where: { customerId },
    select: { id: true },
  });

  const bookingIds = bookings.map((b) => b.id);

  const payments = await prisma.payment.findMany({
    where: { bookingId: { in: bookingIds } },
    orderBy: { createdAt: "desc" },
    include: {
      booking: {
        include: {
          service: { include: { category: true } },
          technicianProfile: {
            include: { user: { omit: { password: true } } },
          },
        },
      },
    },
  });

  return payments;
};

const getPaymentById = async (paymentId: string, userId: string) => {
  const payment = await prisma.payment.findUniqueOrThrow({
    where: { id: paymentId },
    include: {
      booking: {
        include: {
          customer: { omit: { password: true } },
          service: { include: { category: true } },
          technicianProfile: {
            include: { user: { omit: { password: true } } },
          },
        },
      },
    },
  });

  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  if (user.role === "CUSTOMER" && payment.booking.customerId !== userId) {
    throw new Error("You are not authorized to view this payment");
  }

  return payment;
};

export const paymentService = {
  createPaymentSession,
  handleWebhook,
  getMyPayments,
  getPaymentById,
};
