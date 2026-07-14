import { prisma } from "../../lib/prisma";
import { ICreateReviewPayload } from "./review.interface";

const createReview = async (
  payload: ICreateReviewPayload,
  customerId: string
) => {
  const { bookingId, rating, comment } = payload;

  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId, customerId },
  });

  if (booking.status !== "COMPLETED") {
    throw new Error("Reviews can only be left for completed bookings");
  }

  const existingReview = await prisma.review.findUnique({
    where: { bookingId },
  });

  if (existingReview) {
    throw new Error("A review already exists for this booking");
  }

  const review = await prisma.review.create({
    data: {
      bookingId,
      customerId,
      serviceId: booking.serviceId,
      rating,
      comment,
    },
    include: {
      customer: { omit: { password: true } },
      service: { include: { category: true } },
    },
  });

  return review;
};

const getReviewsByService = async (serviceId: string) => {
  const reviews = await prisma.review.findMany({
    where: { serviceId },
    orderBy: { createdAt: "desc" },
    include: {
      customer: { omit: { password: true } },
    },
  });

  return reviews;
};

export const reviewService = {
  createReview,
  getReviewsByService,
};
