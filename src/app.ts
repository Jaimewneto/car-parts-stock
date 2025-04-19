import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import productRoutes from './routes/productRoutes';
import warehouseRoutes from './routes/warehouseRoutes';
import inventoryRoutes from './routes/inventoryRoutes';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors());

// Routes
app.route('/api/products', productRoutes);
app.route('/api/warehouses', warehouseRoutes);
app.route('/api/inventory', inventoryRoutes);

// Health check route
app.get('/', (c) => {
  return c.json({ status: 'ok', message: 'Car Repair Workshop API is running' });
});

export default app;
