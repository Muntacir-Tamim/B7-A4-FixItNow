import { TechnicianProfileWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import {
  ICreateTechnicianProfilePayload,
  ITechnicianQuery,
  IUpdateAvailabilityPayload,
  IUpdateTechnicianProfilePayload,
} from "./technician.interface";

const createProfile = async (
  payload: ICreateTechnicianProfilePayload,
  userId: string
) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
  });

  if (user.role !== "TECHNICIAN") {
    throw new Error("Only technicians can create a technician profile");
  }

  const existingProfile = await prisma.technicianProfile.findUnique({
    where: { userId },
  });

  if (existingProfile) {
    throw new Error("Technician profile already exists");
  }

  const profile = await prisma.technicianProfile.create({
    data: {
      ...payload,
      userId,
    },
    include: {
      user: { omit: { password: true } },
    },
  });

  return profile;
};

const updateProfile = async (
  payload: IUpdateTechnicianProfilePayload,
  userId: string
) => {
  const technicianProfile = await prisma.technicianProfile.findUniqueOrThrow({
    where: { userId },
  });

  const profile = await prisma.technicianProfile.update({
    where: { id: technicianProfile.id },
    data: payload,
    include: {
      user: { omit: { password: true } },
      availability: true,
    },
  });

  return profile;
};

const updateAvailability = async (
  payload: IUpdateAvailabilityPayload,
  userId: string
) => {
  const technicianProfile = await prisma.technicianProfile.findUniqueOrThrow({
    where: { userId },
  });

  const result = await prisma.$transaction(async (tx) => {
    await tx.availability.deleteMany({
      where: { technicianProfileId: technicianProfile.id },
    });

    const availability = await tx.availability.createMany({
      data: payload.slots.map((slot) => ({
        ...slot,
        technicianProfileId: technicianProfile.id,
      })),
    });

    return availability;
  });

  const updatedProfile = await prisma.technicianProfile.findUnique({
    where: { id: technicianProfile.id },
    include: { availability: true },
  });

  return updatedProfile;
};

const getAllTechnicians = async (query: ITechnicianQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const andConditions: TechnicianProfileWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          bio: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          user: {
            name: {
              contains: query.searchTerm,
              mode: "insensitive",
            },
          },
        },
      ],
    });
  }

  if (query.location) {
    andConditions.push({
      location: {
        contains: query.location,
        mode: "insensitive",
      },
    });
  }

  if (query.skills) {
    const skillsArray = query.skills.split(",").map((s) => s.trim());
    andConditions.push({
      skills: {
        hasSome: skillsArray,
      },
    });
  }

  const technicians = await prisma.technicianProfile.findMany({
    where: { AND: andConditions },
    take: limit,
    skip: skip,
    orderBy: { createdAt: "desc" },
    include: {
      user: { omit: { password: true } },
      availability: true,
      services: {
        where: { status: "ACTIVE" },
        include: { category: true },
      },
      _count: {
        select: { bookings: true },
      },
    },
  });

  const totalCount = await prisma.technicianProfile.count({
    where: { AND: andConditions },
  });

  return {
    data: technicians,
    meta: {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

const getTechnicianById = async (technicianId: string) => {
  const technician = await prisma.technicianProfile.findUniqueOrThrow({
    where: { id: technicianId },
    include: {
      user: { omit: { password: true } },
      availability: true,
      services: {
        where: { status: "ACTIVE" },
        include: { category: true },
      },
      bookings: {
        where: { status: "COMPLETED" },
        include: {
          review: {
            include: {
              customer: { omit: { password: true } },
            },
          },
        },
      },
      _count: {
        select: { bookings: true },
      },
    },
  });

  return technician;
};

const getTechnicianBookings = async (userId: string) => {
  const technicianProfile = await prisma.technicianProfile.findUniqueOrThrow({
    where: { userId },
  });

  const bookings = await prisma.booking.findMany({
    where: { technicianProfileId: technicianProfile.id },
    orderBy: { createdAt: "desc" },
    include: {
      customer: { omit: { password: true } },
      service: { include: { category: true } },
      payment: true,
    },
  });

  return bookings;
};

const updateBookingStatus = async (
  bookingId: string,
  status: string,
  userId: string
) => {
  const technicianProfile = await prisma.technicianProfile.findUniqueOrThrow({
    where: { userId },
  });

  const booking = await prisma.booking.findUniqueOrThrow({
    where: {
      id: bookingId,
      technicianProfileId: technicianProfile.id,
    },
  });

  const allowedTransitions: Record<string, string[]> = {
    REQUESTED: ["ACCEPTED", "DECLINED"],
    ACCEPTED: [],
    PAID: ["IN_PROGRESS"],
    IN_PROGRESS: ["COMPLETED"],
    DECLINED: [],
    COMPLETED: [],
    CANCELLED: [],
  };

  const allowed = allowedTransitions[booking.status] ?? [];
  if (!allowed.includes(status)) {
    throw new Error(
      `Cannot transition booking from ${booking.status} to ${status}`
    );
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: status as any },
    include: {
      customer: { omit: { password: true } },
      service: { include: { category: true } },
      payment: true,
    },
  });

  return updatedBooking;
};

export const technicianService = {
  createProfile,
  updateProfile,
  updateAvailability,
  getAllTechnicians,
  getTechnicianById,
  getTechnicianBookings,
  updateBookingStatus,
};
