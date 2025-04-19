import { PrismaClient } from '@prisma/client';

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
  async getAllWarehouses() {
    return prisma.warehouse.findMany();
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
