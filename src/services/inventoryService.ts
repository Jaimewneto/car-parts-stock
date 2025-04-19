import { PrismaClient } from '@prisma/client';

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
  async getAllInventory() {
    return prisma.inventory.findMany({
      include: {
        product: true,
        warehouse: true,
      },
    });
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

  async getInventoryByProductAndWarehouse(productId: number, warehouseId: number) {
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

  async getInventoryByProduct(productId: number) {
    return prisma.inventory.findMany({
      where: {
        productId,
      },
      include: {
        warehouse: true,
      },
    });
  },

  async getInventoryByWarehouse(warehouseId: number) {
    return prisma.inventory.findMany({
      where: {
        warehouseId,
      },
      include: {
        product: true,
      },
    });
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
};
