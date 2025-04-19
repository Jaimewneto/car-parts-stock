import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateProductInput {
  sku: string;
  name: string;
  description?: string;
  category: string;
  brand: string;
  price: number;
  unit: string;
}

export interface UpdateProductInput {
  sku?: string;
  name?: string;
  description?: string;
  category?: string;
  brand?: string;
  price?: number;
  unit?: string;
}

export const productService = {
  async getAllProducts() {
    return prisma.product.findMany();
  },

  async getProductById(id: number) {
    return prisma.product.findUnique({
      where: { id },
    });
  },

  async getProductBySku(sku: string) {
    return prisma.product.findUnique({
      where: { sku },
    });
  },

  async createProduct(data: CreateProductInput) {
    return prisma.product.create({
      data,
    });
  },

  async updateProduct(id: number, data: UpdateProductInput) {
    return prisma.product.update({
      where: { id },
      data,
    });
  },

  async deleteProduct(id: number) {
    return prisma.product.delete({
      where: { id },
    });
  },
};
