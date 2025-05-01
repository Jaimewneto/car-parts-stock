import { PrismaClient } from "@prisma/client";

import { PaginatedResult, PaginationOptions } from "../types/pagination";

const prisma = new PrismaClient();

export interface CreateInventoryInput {
  productId: number;
  warehouseId: number;
  quantity: number;
  minLevel?: number;
}

export interface UpdateInventoryInput {
  quantity?: number;
  minLevel?: number;
}

export const inventoryService = {
  async getAllInventory(
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<any>> {
    const page = options.page || 1;
    const pageSize = options.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      prisma.inventory.findMany({
        skip,
        take: pageSize,
        include: {
          product: true,
          warehouse: true,
        },
        orderBy: { id: "asc" },
      }),
      prisma.inventory.count(),
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

  async getInventoryById(id: number) {
    return prisma.inventory.findUnique({
      where: { id },
      include: {
        product: true,
        warehouse: true,
      },
    });
  },

  async getInventoryByProductAndWarehouse(
    productId: number,
    warehouseId: number
  ) {
    return prisma.inventory.findFirst({
      where: {
        productId,
        warehouseId,
      },
      include: {
        product: true,
        warehouse: true,
      },
    });
  },

  async getInventoryByProduct(
    productId: number,
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<any>> {
    const page = options.page || 1;
    const pageSize = options.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      prisma.inventory.findMany({
        where: {
          productId,
        },
        skip,
        take: pageSize,
        include: {
          warehouse: true,
        },
        orderBy: { id: "asc" },
      }),
      prisma.inventory.count({
        where: {
          productId,
        },
      }),
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

  async getInventoryByWarehouse(
    warehouseId: number,
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<any>> {
    const page = options.page || 1;
    const pageSize = options.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      prisma.inventory.findMany({
        where: {
          warehouseId,
        },
        skip,
        take: pageSize,
        include: {
          product: true,
        },
        orderBy: { id: "asc" },
      }),
      prisma.inventory.count({
        where: {
          warehouseId,
        },
      }),
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

  async createInventory(data: CreateInventoryInput) {
    return prisma.inventory.create({
      data,
      include: {
        product: true,
        warehouse: true,
      },
    });
  },

  async updateInventory(id: number, data: UpdateInventoryInput) {
    return prisma.inventory.update({
      where: { id },
      data,
      include: {
        product: true,
        warehouse: true,
      },
    });
  },

  async deleteInventory(id: number) {
    return prisma.inventory.delete({
      where: { id },
    });
  },

  async addToStock(inventoryId: number, quantity: number, note?: string) {
    return prisma.$transaction(async (tx) => {
      const updated = await tx.inventory.update({
        where: { id: inventoryId },
        data: {
          quantity: {
            increment: quantity,
          },
        },
      });
  
      await tx.cardex.create({
        data: {
          inventoryId,
          addition: quantity,
          withdrawal: 0,
          note,
        },
      });
  
      return updated;
    });
  },
  
  async removeFromStock(inventoryId: number, quantity: number, note?: string) {
    return prisma.$transaction(async (tx) => {
      const updated = await tx.inventory.update({
        where: { id: inventoryId },
        data: {
          quantity: {
            decrement: quantity,
          },
        },
      });
  
      await tx.cardex.create({
        data: {
          inventoryId,
          addition: 0,
          withdrawal: quantity,
          note,
        },
      });
  
      return updated;
    });
  },
  
};
