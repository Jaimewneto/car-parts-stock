import { Context } from "hono";
import { CardexService } from "../services/cardexService";

export const cardexController = {
  async getMovementsByInventory(c: Context) {
    try {
      const inventoryId = Number(c.req.param("inventoryId"));
      const page = parseInt(c.req.query("page") || "1");
      const pageSize = parseInt(c.req.query("pageSize") || "10");

      if (isNaN(inventoryId)) {
        return c.json({ success: false, error: "Invalid inventory ID" }, 400);
      }

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

      const result = await CardexService.getMovementsByInventory(inventoryId, {
        page,
        pageSize,
      });

      return c.json({ success: true, ...result });
    } catch (error) {
      console.error("Error getting cardex movements:", error);
      return c.json(
        { success: false, error: "Failed to get cardex movements" },
        500
      );
    }
  },
};
