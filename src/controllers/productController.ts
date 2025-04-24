import { Context } from "hono";
import {
  productService,
  CreateProductInput,
  UpdateProductInput,
} from "../services/productService";
import { z } from "zod";

const createProductSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().min(1),
  brand: z.string().min(1),
  price: z.number().positive(),
  unit: z.string().min(1),
});

const updateProductSchema = z.object({
  sku: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.string().min(1).optional(),
  brand: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  unit: z.string().min(1).optional(),
});

export const productController = {
  async getAllProducts(c: Context) {
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

      const result = await productService.getAllProducts({ page, pageSize });
      return c.json({ success: true, ...result });
    } catch (error) {
      console.error("Error getting products:", error);
      return c.json({ success: false, error: "Failed to get products" }, 500);
    }
  },

  async getProductById(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      if (isNaN(id)) {
        return c.json({ success: false, error: "Invalid product ID" }, 400);
      }

      const product = await productService.getProductById(id);
      if (!product) {
        return c.json({ success: false, error: "Product not found" }, 404);
      }

      return c.json({ success: true, data: product });
    } catch (error) {
      console.error("Error getting product:", error);
      return c.json({ success: false, error: "Failed to get product" }, 500);
    }
  },

  async createProduct(c: Context) {
    try {
      const body = await c.req.json();
      const validationResult = createProductSchema.safeParse(body);

      if (!validationResult.success) {
        return c.json(
          { success: false, error: validationResult.error.format() },
          400
        );
      }

      const data = validationResult.data as CreateProductInput;

      // Check if product with SKU already exists
      const existingProduct = await productService.getProductBySku(data.sku);
      if (existingProduct) {
        return c.json(
          { success: false, error: "Product with this SKU already exists" },
          409
        );
      }

      const product = await productService.createProduct(data);
      return c.json({ success: true, data: product }, 201);
    } catch (error) {
      console.error("Error creating product:", error);
      return c.json({ success: false, error: "Failed to create product" }, 500);
    }
  },

  async updateProduct(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      if (isNaN(id)) {
        return c.json({ success: false, error: "Invalid product ID" }, 400);
      }

      const body = await c.req.json();
      const validationResult = updateProductSchema.safeParse(body);

      if (!validationResult.success) {
        return c.json(
          { success: false, error: validationResult.error.format() },
          400
        );
      }

      const data = validationResult.data as UpdateProductInput;

      // Check if product exists
      const existingProduct = await productService.getProductById(id);
      if (!existingProduct) {
        return c.json({ success: false, error: "Product not found" }, 404);
      }

      // If SKU is being updated, check if it conflicts with another product
      if (data.sku && data.sku !== existingProduct.sku) {
        const conflictProduct = await productService.getProductBySku(data.sku);
        if (conflictProduct && conflictProduct.id !== id) {
          return c.json(
            {
              success: false,
              error: "Another product with this SKU already exists",
            },
            409
          );
        }
      }

      const product = await productService.updateProduct(id, data);
      return c.json({ success: true, data: product });
    } catch (error) {
      console.error("Error updating product:", error);
      return c.json({ success: false, error: "Failed to update product" }, 500);
    }
  },

  async deleteProduct(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      if (isNaN(id)) {
        return c.json({ success: false, error: "Invalid product ID" }, 400);
      }

      // Check if product exists
      const existingProduct = await productService.getProductById(id);
      if (!existingProduct) {
        return c.json({ success: false, error: "Product not found" }, 404);
      }

      await productService.deleteProduct(id);
      return c.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      return c.json({ success: false, error: "Failed to delete product" }, 500);
    }
  },
};
