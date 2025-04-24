import { Context } from "hono";
import {
  inventoryService,
  CreateInventoryInput,
  UpdateInventoryInput,
} from "../services/inventoryService";
import { productService } from "../services/productService";
import { warehouseService } from "../services/warehouseService";
import { z } from "zod";

const createInventorySchema = z.object({
  productId: z.number().int().positive(),
  warehouseId: z.number().int().positive(),
  quantity: z.number().int().min(0),
  minLevel: z.number().int().min(0).optional(),
});

const updateInventorySchema = z.object({
  quantity: z.number().int().min(0).optional(),
  minLevel: z.number().int().min(0).optional(),
});

export const inventoryController = {
  async getAllInventory(c: Context) {
    try {
      const page = parseInt(c.req.query("page") || "1");
      const pageSize = parseInt(c.req.query("pageSize") || "10");

      if (isNaN(page) || page < 1 || isNaN(pageSize) || pageSize < 1) {
        return c.json(
          {
            success: false,
            error:
              "Invalid pagination parameters. Page and pageSize must be positive integers.",
          },
          400
        );
      }

      const result = await inventoryService.getAllInventory({ page, pageSize });
      return c.json({ success: true, ...result });
    } catch (error) {
      console.error("Error getting inventory:", error);
      return c.json({ success: false, error: "Failed to get inventory" }, 500);
    }
  },

  async getInventoryById(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      if (isNaN(id)) {
        return c.json({ success: false, error: "Invalid inventory ID" }, 400);
      }

      const inventory = await inventoryService.getInventoryById(id);
      if (!inventory) {
        return c.json({ success: false, error: "Inventory not found" }, 404);
      }

      return c.json({ success: true, data: inventory });
    } catch (error) {
      console.error("Error getting inventory:", error);
      return c.json({ success: false, error: "Failed to get inventory" }, 500);
    }
  },

  async getInventoryByWarehouse(c: Context) {
    try {
      const warehouseId = Number(c.req.param("warehouseId"));
      if (isNaN(warehouseId)) {
        return c.json({ success: false, error: "Invalid warehouse ID" }, 400);
      }

      const page = parseInt(c.req.query("page") || "1");
      const pageSize = parseInt(c.req.query("pageSize") || "10");

      if (isNaN(page) || page < 1 || isNaN(pageSize) || pageSize < 1) {
        return c.json(
          {
            success: false,
            error:
              "Invalid pagination parameters. Page and pageSize must be positive integers.",
          },
          400
        );
      }

      // Check if warehouse exists
      const warehouse = await warehouseService.getWarehouseById(warehouseId);
      if (!warehouse) {
        return c.json({ success: false, error: "Warehouse not found" }, 404);
      }

      const result = await inventoryService.getInventoryByWarehouse(
        warehouseId,
        { page, pageSize }
      );
      return c.json({ success: true, ...result });
    } catch (error) {
      console.error("Error getting warehouse inventory:", error);
      return c.json(
        { success: false, error: "Failed to get warehouse inventory" },
        500
      );
    }
  },

  async getInventoryByProduct(c: Context) {
    try {
      const productId = Number(c.req.param("productId"));
      if (isNaN(productId)) {
        return c.json({ success: false, error: "Invalid product ID" }, 400);
      }

      const page = parseInt(c.req.query("page") || "1");
      const pageSize = parseInt(c.req.query("pageSize") || "10");

      if (isNaN(page) || page < 1 || isNaN(pageSize) || pageSize < 1) {
        return c.json(
          {
            success: false,
            error:
              "Invalid pagination parameters. Page and pageSize must be positive integers.",
          },
          400
        );
      }

      // Check if product exists
      const product = await productService.getProductById(productId);
      if (!product) {
        return c.json({ success: false, error: "Product not found" }, 404);
      }

      const result = await inventoryService.getInventoryByProduct(productId, {
        page,
        pageSize,
      });
      return c.json({ success: true, ...result });
    } catch (error) {
      console.error("Error getting product inventory:", error);
      return c.json(
        { success: false, error: "Failed to get product inventory" },
        500
      );
    }
  },

  async createInventory(c: Context) {
    try {
      const body = await c.req.json();
      const validationResult = createInventorySchema.safeParse(body);

      if (!validationResult.success) {
        return c.json(
          { success: false, error: validationResult.error.format() },
          400
        );
      }

      const data = validationResult.data as CreateInventoryInput;

      // Check if product exists
      const product = await productService.getProductById(data.productId);
      if (!product) {
        return c.json({ success: false, error: "Product not found" }, 404);
      }

      // Check if warehouse exists
      const warehouse = await warehouseService.getWarehouseById(
        data.warehouseId
      );
      if (!warehouse) {
        return c.json({ success: false, error: "Warehouse not found" }, 404);
      }

      // Check if inventory already exists for this product and warehouse
      const existingInventory =
        await inventoryService.getInventoryByProductAndWarehouse(
          data.productId,
          data.warehouseId
        );

      if (existingInventory) {
        return c.json(
          {
            success: false,
            error:
              "Inventory for this product in this warehouse already exists",
            inventoryId: existingInventory.id,
          },
          409
        );
      }

      const inventory = await inventoryService.createInventory(data);
      return c.json({ success: true, data: inventory }, 201);
    } catch (error) {
      console.error("Error creating inventory:", error);
      return c.json(
        { success: false, error: "Failed to create inventory" },
        500
      );
    }
  },

  async updateInventory(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      if (isNaN(id)) {
        return c.json({ success: false, error: "Invalid inventory ID" }, 400);
      }

      const body = await c.req.json();
      const validationResult = updateInventorySchema.safeParse(body);

      if (!validationResult.success) {
        return c.json(
          { success: false, error: validationResult.error.format() },
          400
        );
      }

      const data = validationResult.data as UpdateInventoryInput;

      // Check if inventory exists
      const existingInventory = await inventoryService.getInventoryById(id);
      if (!existingInventory) {
        return c.json({ success: false, error: "Inventory not found" }, 404);
      }

      const inventory = await inventoryService.updateInventory(id, data);
      return c.json({ success: true, data: inventory });
    } catch (error) {
      console.error("Error updating inventory:", error);
      return c.json(
        { success: false, error: "Failed to update inventory" },
        500
      );
    }
  },

  async deleteInventory(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      if (isNaN(id)) {
        return c.json({ success: false, error: "Invalid inventory ID" }, 400);
      }

      // Check if inventory exists
      const existingInventory = await inventoryService.getInventoryById(id);
      if (!existingInventory) {
        return c.json({ success: false, error: "Inventory not found" }, 404);
      }

      await inventoryService.deleteInventory(id);
      return c.json({
        success: true,
        message: "Inventory deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting inventory:", error);
      return c.json(
        { success: false, error: "Failed to delete inventory" },
        500
      );
    }
  },
};
