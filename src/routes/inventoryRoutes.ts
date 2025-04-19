import { Hono } from 'hono';
import { inventoryController } from '../controllers/inventoryController';

const inventoryRoutes = new Hono();

inventoryRoutes.get('/', inventoryController.getAllInventory);
inventoryRoutes.get('/:id', inventoryController.getInventoryById);
inventoryRoutes.get('/warehouse/:warehouseId', inventoryController.getInventoryByWarehouse);
inventoryRoutes.get('/product/:productId', inventoryController.getInventoryByProduct);
inventoryRoutes.post('/', inventoryController.createInventory);
inventoryRoutes.put('/:id', inventoryController.updateInventory);
inventoryRoutes.delete('/:id', inventoryController.deleteInventory);

export default inventoryRoutes;
