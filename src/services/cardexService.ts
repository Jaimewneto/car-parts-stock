import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class CardexService {
  static async registerMovement(params: {
    inventoryId: number;
    addition?: number;
    withdrawal?: number;
    note?: string;
  }) {
    const { inventoryId, addition = 0, withdrawal = 0, note } = params;

    if (addition < 0 || withdrawal < 0) {
      throw new Error("Valores negativos não são permitidos.");
    }

    if (addition > 0 && withdrawal > 0) {
      throw new Error("Somente um dos campos (addition ou withdrawal) pode ter valor.");
    }

    const inventory = await prisma.inventory.findUnique({
      where: { id: inventoryId },
    });

    if (!inventory) {
      throw new Error("Estoque (Inventory) não encontrado.");
    }

    // Calcula nova quantidade
    const updatedInventory = await prisma.inventory.update({
      where: { id: inventoryId },
      data: {
        quantity: {
          increment: addition - withdrawal,
        },
      },
    });

    const cardexEntry = await prisma.cardex.create({
      data: {
        inventoryId,
        addition,
        withdrawal,
        note,
      },
    });

    return {
      updatedInventory,
      cardexEntry,
    };
  }

  static async getMovementsByInventory(inventoryId: number) {
    return prisma.cardex.findMany({
      where: { inventoryId },
      orderBy: { createdAt: "desc" },
    });
  }
}
