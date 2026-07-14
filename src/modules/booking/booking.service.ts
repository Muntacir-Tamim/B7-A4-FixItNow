import { prisma } from "../../lib/prisma";
import { ICreateBookingPayload } from "./booking.interface";

const createBooking = async (
  payload: ICreateBookingPayload,
  customerId: string
) => {
  const { serviceId, scheduledDate, scheduledTime, address, note } = payload;

  const service = await prisma.service.findUniqueOrThrow({
    where: { id: serviceId, status: "ACTIVE" },
    include: { technicianProfile: true },
  });

  const booking = await prisma.booking.create({
    data: {
      customerId,
      serviceId,
      technicianProfileId: service.technicianProfileId,
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      address,
      note,
      totalAmount: service.price,
      status: "REQUESTED",
    },
    include: {
      service: { include: { category: true } },
      technicianProfile: {
        include: { user: { omit: { password: true } } },
      },
      customer: { omit: { password: true } },
    },
  });

  return booking;
};

const getMyBookings = async (customerId: string) => {
  const bookings = await prisma.booking.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
    include: {
      service: { include: { category: true } },
      technicianProfile: {
        include: { user: { omit: { password: true } } },
      },
      payment: true,
      review: true,
    },
  });

  return bookings;
};

const getBookingById = async (bookingId: string, userId: string) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    include: {
      service: { include: { category: true } },
      technicianProfile: {
        include: { user: { omit: { password: true } } },
      },
      customer: { omit: { password: true } },
      payment: true,
      review: true,
    },
  });

  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  if (user.role === "CUSTOMER" && booking.customerId !== userId) {
    throw new Error("You are not authorized to view this booking");
  }

  if (user.role === "TECHNICIAN") {
    const techProfile = await prisma.technicianProfile.findUnique({
      where: { userId },
    });
    if (booking.technicianProfileId !== techProfile?.id) {
      throw new Error("You are not authorized to view this booking");
    }
  }

  return booking;
};

const cancelBooking = async (bookingId: string, customerId: string) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId, customerId },
  });

  if (booking.status === "IN_PROGRESS" || booking.status === "COMPLETED") {
    throw new Error(
      `Cannot cancel a booking that is already ${booking.status}`
    );
  }

  if (booking.status === "CANCELLED") {
    throw new Error("Booking is already cancelled");
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
    include: {
      service: { include: { category: true } },
      technicianProfile: {
        include: { user: { omit: { password: true } } },
      },
    },
  });

  return updatedBooking;
};

export const bookingService = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};
