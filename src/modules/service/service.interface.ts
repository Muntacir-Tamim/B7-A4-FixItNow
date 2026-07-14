import { ServiceStatus } from "../../../generated/prisma/enums";
import { ServiceWhereInput } from "../../../generated/prisma/models";

export interface ICreateServicePayload {
  title: string;
  description: string;
  price: number;
  location?: string;
  categoryId: string;
  status?: ServiceStatus;
}

export interface IUpdateServicePayload {
  title?: string;
  description?: string;
  price?: number;
  location?: string;
  categoryId?: string;
  status?: ServiceStatus;
}

export interface IServiceQuery extends ServiceWhereInput {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortOrder?: string;
  sortBy?: string;
  categoryId?: string;
  location?: string;
  minPrice?: string;
  maxPrice?: string;
}
