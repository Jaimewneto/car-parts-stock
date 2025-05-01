import { Hono } from 'hono';
import { inventoryController } from '../controllers/inventoryController';

const inventoryRoutes = new Hono();

inventoryRoutes.post("/:id/increment-stock", inventoryController.addToStock);
inventoryRoutes.post("/:id/decrement-stock", inventoryController.removeFromStock);

inventoryRoutes.get('/', inventoryController.getAllInventory);
inventoryRoutes.get('/:id', inventoryController.getInventoryById);
inventoryRoutes.get('/warehouse/:warehouseId', inventoryController.getInventoryByWarehouse);
inventoryRoutes.get('/product/:productId', inventoryController.getInventoryByProduct);
inventoryRoutes.post('/', inventoryController.createInventory);
inventoryRoutes.patch('/:id', inventoryController.updateInventory);
inventoryRoutes.delete('/:id', inventoryController.deleteInventory);

export default inventoryRoutes;
