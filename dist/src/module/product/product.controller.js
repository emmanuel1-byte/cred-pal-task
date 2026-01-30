"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_service_1 = require("./product.service");
const product_schema_1 = require("./product.schema");
class ProductController {
    constructor() {
        this.productService = new product_service_1.ProductService();
        this.createProduct = async (req, res, next) => {
            try {
                const validatedRequestPayload = product_schema_1.createProductSchema.parse(req.body);
                const product = await this.productService.createProduct(validatedRequestPayload);
                return res.status(201).json({
                    success: true,
                    message: "Product created successfully",
                    data: product,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateProduct = async (req, res, next) => {
            try {
                const { id } = product_schema_1.productParamSchema.parse(req.params);
                const validatedRequestPayload = product_schema_1.updateProductSchema.parse(req.body);
                const product = await this.productService.updateProduct(id, validatedRequestPayload);
                return res.status(200).json({
                    success: true,
                    message: "Product updated successfully",
                    data: product,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.listProducts = async (req, res, next) => {
            try {
                const { page, limit, search } = product_schema_1.productQuerySchema.parse(req.query);
                const products = await this.productService.listProducts(page, limit, search);
                return res.status(200).json({
                    success: true,
                    message: "Products retrieved successfully",
                    data: products,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getProduct = async (req, res, next) => {
            try {
                const { id } = product_schema_1.productParamSchema.parse(req.params);
                const product = await this.productService.getproduct(id);
                return res.status(200).json({
                    success: true,
                    data: { product },
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteProduct = async (req, res, next) => {
            try {
                const { id } = product_schema_1.productParamSchema.parse(req.params);
                await this.productService.deleteProduct(id);
                return res.status(200).json({
                    success: true,
                    message: "Product deleted successfully",
                });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.ProductController = ProductController;
