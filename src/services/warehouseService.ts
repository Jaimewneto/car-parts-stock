import { PrismaClient } from "@prisma/client";

import { PaginatedResult, PaginationOptions } from "../types/pagination";

const prisma = new PrismaClient();

export interface CreateWarehouseInput {
  name: string;
  location: string;
}

export interface UpdateWarehouseInput {
  name?: string;
  location?: string;
}

export const warehouseService = {
  async getAllWarehouses(
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<any>> {
    const page = options.page || 1;
    const pageSize = options.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      prisma.warehouse.findMany({
        skip,
        take: pageSize,
        orderBy: { id: "asc" },
      }),
      prisma.warehouse.count(),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      data,
      meta: {
        total,
        page,
        pageSize,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  },

  async getWarehouseById(id: number) {
    return prisma.warehouse.findUnique({
      where: { id },
    });
  },

  async createWarehouse(data: CreateWarehouseInput) {
    return prisma.warehouse.create({
      data,
    });
  },

  async updateWarehouse(id: number, data: UpdateWarehouseInput) {
    return prisma.warehouse.update({
      where: { id },
      data,
    });
  },

  async deleteWarehouse(id: number) {
    return prisma.warehouse.delete({
      where: { id },
    });
  },
};
