import { Hono } from 'hono';
import { warehouseController } from '../controllers/warehouseController';

const warehouseRoutes = new Hono();

warehouseRoutes.get('/', warehouseController.getAllWarehouses);
warehouseRoutes.get('/:id', warehouseController.getWarehouseById);
warehouseRoutes.post('/', warehouseController.createWarehouse);
warehouseRoutes.patch('/:id', warehouseController.updateWarehouse);
warehouseRoutes.delete('/:id', warehouseController.deleteWarehouse);

export default warehouseRoutes;
