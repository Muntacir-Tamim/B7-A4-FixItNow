import { BookingWhereInput, UserWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const getAllUsers = async (query: {
  page?: string;
  limit?: string;
  role?: string;
  searchTerm?: string;
  status?: string;
}) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const andConditions: UserWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: query.searchTerm, mode: "insensitive" } },
        { email: { contains: query.searchTerm, mode: "insensitive" } },
      ],
    });
  }

  if (query.role) {
    andConditions.push({ role: query.role as any });
  }

  if (query.status) {
    andConditions.push({ status: query.status as any });
  }

  const users = await prisma.user.findMany({
    where: { AND: andConditions },
    take: limit,
    skip: skip,
    orderBy: { createdAt: "desc" },
    omit: { password: true },
    include: {
      technicianProfile: {
        include: { availability: true },
      },
    },
  });

  const totalCount = await prisma.user.count({
    where: { AND: andConditions },
  });

  return {
    data: users,
    meta: {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

const updateUserStatus = async (
  userId: string,
  status: "ACTIVE" | "BANNED"
) => {
  await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  const user = await prisma.user.update({
    where: { id: userId },
    data: { status },
    omit: { password: true },
  });

  return user;
};

const getAllBookings = async (query: {
  page?: string;
  limit?: string;
  status?: string;
}) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const andConditions: BookingWhereInput[] = [];

  if (query.status) {
    andConditions.push({ status: query.status as any });
  }

  const bookings = await prisma.booking.findMany({
    where: { AND: andConditions },
    take: limit,
    skip: skip,
    orderBy: { createdAt: "desc" },
    include: {
      customer: { omit: { password: true } },
      technicianProfile: {
        include: { user: { omit: { password: true } } },
      },
      service: { include: { category: true } },
      payment: true,
    },
  });

  const totalCount = await prisma.booking.count({
    where: { AND: andConditions },
  });

  return {
    data: bookings,
    meta: {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

const getDashboardStats = async () => {
  const result = await prisma.$transaction(async (tx) => {
    const [
      totalUsers,
      totalCustomers,
      totalTechnicians,
      totalBookings,
      totalCompletedBookings,
      totalPendingBookings,
      totalRevenue,
      totalServices,
      totalCategories,
    ] = await Promise.all([
      tx.user.count(),
      tx.user.count({ where: { role: "CUSTOMER" } }),
      tx.user.count({ where: { role: "TECHNICIAN" } }),
      tx.booking.count(),
      tx.booking.count({ where: { status: "COMPLETED" } }),
      tx.booking.count({ where: { status: "REQUESTED" } }),
      tx.payment.aggregate({
        _sum: { amount: true },
        where: { status: "COMPLETED" },
      }),
      tx.service.count(),
      tx.category.count(),
    ]);

    return {
      totalUsers,
      totalCustomers,
      totalTechnicians,
      totalBookings,
      totalCompletedBookings,
      totalPendingBookings,
      totalRevenue: totalRevenue._sum.amount ?? 0,
      totalServices,
      totalCategories,
    };
  });

  return result;
};

export const adminService = {
  getAllUsers,
  updateUserStatus,
  getAllBookings,
  getDashboardStats,
};
