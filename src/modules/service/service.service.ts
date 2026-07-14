import { ServiceWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import {
  ICreateServicePayload,
  IServiceQuery,
  IUpdateServicePayload,
} from "./service.interface";

const createService = async (
  payload: ICreateServicePayload,
  userId: string
) => {
  const technicianProfile = await prisma.technicianProfile.findUniqueOrThrow({
    where: { userId },
  });

  await prisma.category.findUniqueOrThrow({
    where: { id: payload.categoryId },
  });

  const service = await prisma.service.create({
    data: {
      ...payload,
      technicianProfileId: technicianProfile.id,
    },
    include: {
      category: true,
      technicianProfile: {
        include: {
          user: { omit: { password: true } },
        },
      },
    },
  });

  return service;
};

const getAllServices = async (query: IServiceQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";

  const andConditions: ServiceWhereInput[] = [];

  andConditions.push({ status: "ACTIVE" });

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (query.categoryId) {
    andConditions.push({ categoryId: query.categoryId });
  }

  if (query.location) {
    andConditions.push({
      location: {
        contains: query.location as string,
        mode: "insensitive",
      },
    });
  }

  if (query.minPrice) {
    andConditions.push({
      price: { gte: Number(query.minPrice) },
    });
  }

  if (query.maxPrice) {
    andConditions.push({
      price: { lte: Number(query.maxPrice) },
    });
  }

  const services = await prisma.service.findMany({
    where: { AND: andConditions },
    take: limit,
    skip: skip,
    orderBy: { [sortBy]: sortOrder },
    include: {
      category: true,
      technicianProfile: {
        include: {
          user: { omit: { password: true } },
        },
      },
      reviews: {
        select: { rating: true },
      },
      _count: {
        select: { reviews: true, bookings: true },
      },
    },
  });

  const totalCount = await prisma.service.count({
    where: { AND: andConditions },
  });

  return {
    data: services,
    meta: {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

const getServiceById = async (serviceId: string) => {
  const service = await prisma.service.findUniqueOrThrow({
    where: { id: serviceId },
    include: {
      category: true,
      technicianProfile: {
        include: {
          user: { omit: { password: true } },
          availability: true,
        },
      },
      reviews: {
        include: {
          customer: { omit: { password: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: { reviews: true, bookings: true },
      },
    },
  });

  return service;
};

const updateService = async (
  serviceId: string,
  payload: IUpdateServicePayload,
  userId: string
) => {
  const technicianProfile = await prisma.technicianProfile.findUniqueOrThrow({
    where: { userId },
  });

  await prisma.service.findUniqueOrThrow({
    where: {
      id: serviceId,
      technicianProfileId: technicianProfile.id,
    },
  });

  const service = await prisma.service.update({
    where: { id: serviceId },
    data: payload,
    include: {
      category: true,
    },
  });

  return service;
};

const deleteService = async (serviceId: string, userId: string) => {
  const technicianProfile = await prisma.technicianProfile.findUniqueOrThrow({
    where: { userId },
  });

  await prisma.service.findUniqueOrThrow({
    where: {
      id: serviceId,
      technicianProfileId: technicianProfile.id,
    },
  });

  await prisma.service.delete({
    where: { id: serviceId },
  });
};

export const serviceService = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
