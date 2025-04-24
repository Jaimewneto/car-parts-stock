import { Context } from "hono";
import {
  warehouseService,
  CreateWarehouseInput,
  UpdateWarehouseInput,
} from "../services/warehouseService";
import { z } from "zod";

const createWarehouseSchema = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
});

const updateWarehouseSchema = z.object({
  name: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
});

export const warehouseController = {
  async getAllWarehouses(c: Context) {
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

      const result = await warehouseService.getAllWarehouses({
        page,
        pageSize,
      });
      return c.json({ success: true, ...result });
    } catch (error) {
      console.error("Error getting warehouses:", error);
      return c.json({ success: false, error: "Failed to get warehouses" }, 500);
    }
  },

  async getWarehouseById(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      if (isNaN(id)) {
        return c.json({ success: false, error: "Invalid warehouse ID" }, 400);
      }

      const warehouse = await warehouseService.getWarehouseById(id);
      if (!warehouse) {
        return c.json({ success: false, error: "Warehouse not found" }, 404);
      }

      return c.json({ success: true, data: warehouse });
    } catch (error) {
      console.error("Error getting warehouse:", error);
      return c.json({ success: false, error: "Failed to get warehouse" }, 500);
    }
  },

  async createWarehouse(c: Context) {
    try {
      const body = await c.req.json();
      const validationResult = createWarehouseSchema.safeParse(body);

      if (!validationResult.success) {
        return c.json(
          { success: false, error: validationResult.error.format() },
          400
        );
      }

      const data = validationResult.data as CreateWarehouseInput;
      const warehouse = await warehouseService.createWarehouse(data);
      return c.json({ success: true, data: warehouse }, 201);
    } catch (error) {
      console.error("Error creating warehouse:", error);
      return c.json(
        { success: false, error: "Failed to create warehouse" },
        500
      );
    }
  },

  async updateWarehouse(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      if (isNaN(id)) {
        return c.json({ success: false, error: "Invalid warehouse ID" }, 400);
      }

      const body = await c.req.json();
      const validationResult = updateWarehouseSchema.safeParse(body);

      if (!validationResult.success) {
        return c.json(
          { success: false, error: validationResult.error.format() },
          400
        );
      }

      const data = validationResult.data as UpdateWarehouseInput;

      // Check if warehouse exists
      const existingWarehouse = await warehouseService.getWarehouseById(id);
      if (!existingWarehouse) {
        return c.json({ success: false, error: "Warehouse not found" }, 404);
      }

      const warehouse = await warehouseService.updateWarehouse(id, data);
      return c.json({ success: true, data: warehouse });
    } catch (error) {
      console.error("Error updating warehouse:", error);
      return c.json(
        { success: false, error: "Failed to update warehouse" },
        500
      );
    }
  },

  async deleteWarehouse(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      if (isNaN(id)) {
        return c.json({ success: false, error: "Invalid warehouse ID" }, 400);
      }

      // Check if warehouse exists
      const existingWarehouse = await warehouseService.getWarehouseById(id);
      if (!existingWarehouse) {
        return c.json({ success: false, error: "Warehouse not found" }, 404);
      }

      await warehouseService.deleteWarehouse(id);
      return c.json({
        success: true,
        message: "Warehouse deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting warehouse:", error);
      return c.json(
        { success: false, error: "Failed to delete warehouse" },
        500
      );
    }
  },
};
