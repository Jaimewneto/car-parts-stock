import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import productRoutes from './routes/productRoutes';
import warehouseRoutes from './routes/warehouseRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import cardexRoutes from './routes/cardexRoutes';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors());

// Routes
app.route('/api/product', productRoutes);
app.route('/api/warehouse', warehouseRoutes);
app.route('/api/inventory', inventoryRoutes);
app.route('/api/cardex', cardexRoutes);

// Health check route
app.get('/', (c) => {
  return c.json({ status: 'ok', message: 'Car Repair Workshop API is running' });
});

export default app;
