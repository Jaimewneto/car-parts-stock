import { PaginatedResult, PaginationOptions } from "../types/pagination";

import prisma from '../prismaClient';

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
  async getAllProducts(
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<any>> {
    const page = options.page || 1;
    const pageSize = options.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const where = options.query
      ? {
          OR: [
            {
              name: {
                contains: options.query,
                mode: "insensitive" as const,
              },
            },
            {
              description: {
                contains: options.query,
                mode: "insensitive" as const,
              },
            },
            {
              sku: {
                contains: options.query,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : undefined;

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { id: "asc" },
        include: {
          inventory: {
            include: {
              warehouse: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
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

  async getProductById(id: number) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        inventory: {
          include: {
            warehouse: true,
          },
        },
      },
    });
  },

  async getProductBySku(sku: string) {
    return prisma.product.findUnique({
      where: { sku },
      include: {
        inventory: {
          include: {
            warehouse: true,
          },
        },
      },
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
