import { Hono } from 'hono';
import { productController } from '../controllers/productController';

const productRoutes = new Hono();

productRoutes.get('/', productController.getAllProducts);
productRoutes.get('/:id', productController.getProductById);
productRoutes.post('/', productController.createProduct);
productRoutes.put('/:id', productController.updateProduct);
productRoutes.delete('/:id', productController.deleteProduct);

export default productRoutes;
