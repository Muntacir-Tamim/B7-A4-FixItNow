import { prisma } from "../../lib/prisma";
import {
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
} from "./category.interface";

const createCategory = async (payload: ICreateCategoryPayload) => {
  const category = await prisma.category.create({
    data: payload,
  });

  return category;
};

const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { services: true },
      },
    },
  });

  return categories;
};

const getCategoryById = async (categoryId: string) => {
  const category = await prisma.category.findUniqueOrThrow({
    where: { id: categoryId },
    include: {
      services: {
        where: { status: "ACTIVE" },
        include: {
          technicianProfile: {
            include: {
              user: {
                omit: { password: true },
              },
            },
          },
        },
      },
    },
  });

  return category;
};

const updateCategory = async (
  categoryId: string,
  payload: IUpdateCategoryPayload
) => {
  const category = await prisma.category.update({
    where: { id: categoryId },
    data: payload,
  });

  return category;
};

const deleteCategory = async (categoryId: string) => {
  await prisma.category.findUniqueOrThrow({
    where: { id: categoryId },
  });

  await prisma.category.delete({
    where: { id: categoryId },
  });
};

export const categoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
