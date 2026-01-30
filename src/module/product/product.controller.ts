import { Request, Response, NextFunction } from "express";
import { ProductService } from "./product.service";
import {
  productParamSchema,
  productQuerySchema,
  createProductSchema,
  updateProductSchema,
} from "./product.schema";

export class ProductController {
  private readonly productService = new ProductService();

  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedRequestPayload = createProductSchema.parse(req.body);

      const product = await this.productService.createProduct(
        validatedRequestPayload,
      );

      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = productParamSchema.parse(req.params);
      const validatedRequestPayload = updateProductSchema.parse(req.body);

      const product = await this.productService.updateProduct(
        id,
        validatedRequestPayload,
      );

      return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  listProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, search } = productQuerySchema.parse(req.query);

      const products = await this.productService.listProducts(
        page,
        limit,
        search,
      );

      return res.status(200).json({
        success: true,
        message: "Products retrieved successfully",
        data: products,
      });
    } catch (error) {
      next(error);
    }
  };

  getProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = productParamSchema.parse(req.params);

      const product = await this.productService.getproduct(id);

      return res.status(200).json({
        success: true,
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = productParamSchema.parse(req.params);

      await this.productService.deleteProduct(id);

      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
