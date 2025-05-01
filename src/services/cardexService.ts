import { PrismaClient } from "@prisma/client";

import { PaginationOptions } from "../types/pagination";

const prisma = new PrismaClient();

export class CardexService {
  static async getMovementsByInventory(
    inventoryId: number,
    options: PaginationOptions = {}
  ) {
    const page = options.page || 1;
    const pageSize = options.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      prisma.cardex.findMany({
        where: { inventoryId },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.cardex.count({
        where: { inventoryId },
      }),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
