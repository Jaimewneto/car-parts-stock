import { serve } from '@hono/node-server';
import app from './app';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

console.log(`Server is starting on port ${PORT}...`);

serve({
  fetch: app.fetch,
  port: PORT,
});

console.log(`Server is running on http://localhost:${PORT}`);
