"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const product_model_1 = __importDefault(require("./product.model"));
class ProductService {
    async createProduct(data) {
        const existingProduct = await product_model_1.default.findOne({ name: data.name });
        if (existingProduct) {
            throw (0, http_errors_1.default)(409, "Product already exists");
        }
        const newProduct = await product_model_1.default.create({ ...data });
        return newProduct;
    }
    async listProducts(page, limit, searchQuery) {
        const query = searchQuery
            ? { name: { $regex: `^${searchQuery}`, $options: "i" } }
            : {};
        const [products, productCount] = await Promise.all([
            product_model_1.default.find(query)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 }),
            product_model_1.default.countDocuments(query),
        ]);
        return {
            products,
            meta: {
                page,
                limit,
                total: productCount,
                totalPages: Math.ceil(productCount / limit),
            },
        };
    }
    async getproduct(productId) {
        const existingProduct = await product_model_1.default.findById(productId);
        if (!existingProduct) {
            throw (0, http_errors_1.default)(404, "Product not found");
        }
        return existingProduct;
    }
    async updateProduct(productId, payload) {
        const updatedProduct = await product_model_1.default.findByIdAndUpdate(productId, { ...payload }, { new: true });
        if (!updatedProduct) {
            throw (0, http_errors_1.default)(404, "Product not found");
        }
        return updatedProduct;
    }
    async deleteProduct(productId) {
        const existingProduct = await product_model_1.default.findByIdAndDelete(productId);
        if (!existingProduct) {
            throw (0, http_errors_1.default)(404, "Product not found");
        }
        return existingProduct;
    }
}
exports.ProductService = ProductService;
