import { Hono } from "hono";
import { cardexController } from "../controllers/cardexController";

const cardexRoutes = new Hono();

cardexRoutes.get("/:inventoryId", cardexController.getMovementsByInventory);

export default cardexRoutes;
