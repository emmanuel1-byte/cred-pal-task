"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_service_1 = require("../product.service");
const product_model_1 = __importDefault(require("../product.model"));
const http_errors_1 = __importDefault(require("http-errors"));
jest.mock("./product.model");
const mockProduct = {
    id: "prod123",
    name: "Test Product",
    createdAt: new Date(),
};
describe("ProductService", () => {
    let productService;
    beforeEach(() => {
        productService = new product_service_1.ProductService();
        jest.clearAllMocks();
    });
    describe("createProduct", () => {
        it("throws 409 if product already exists", async () => {
            product_model_1.default.findOne.mockResolvedValue(mockProduct);
            await expect(productService.createProduct({ name: "Test Product" }))
                .rejects.toThrow((0, http_errors_1.default)(409));
        });
        it("creates a new product", async () => {
            product_model_1.default.findOne.mockResolvedValue(null);
            product_model_1.default.create.mockResolvedValue(mockProduct);
            const result = await productService.createProduct({ name: "New Product" });
            expect(product_model_1.default.create).toHaveBeenCalledWith({ name: "New Product" });
            expect(result).toEqual(mockProduct);
        });
    });
    describe("listProducts", () => {
        it("returns paginated products without search query", async () => {
            product_model_1.default.find.mockReturnValue({
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                sort: jest.fn().mockResolvedValue([mockProduct]),
            });
            product_model_1.default.countDocuments.mockResolvedValue(1);
            const result = await productService.listProducts(1, 10, "");
            expect(result).toEqual({
                products: [mockProduct],
                meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
            });
        });
        it("returns paginated products with search query", async () => {
            product_model_1.default.find.mockReturnValue({
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                sort: jest.fn().mockResolvedValue([mockProduct]),
            });
            product_model_1.default.countDocuments.mockResolvedValue(1);
            const result = await productService.listProducts(1, 10, "Test");
            expect(product_model_1.default.find).toHaveBeenCalledWith({ name: { $regex: "^Test", $options: "i" } });
            expect(result.meta.totalPages).toBe(1);
        });
    });
    describe("getproduct", () => {
        it("throws 404 if product not found", async () => {
            product_model_1.default.findById.mockResolvedValue(null);
            await expect(productService.getproduct("prod123")).rejects.toThrow((0, http_errors_1.default)(404));
        });
        it("returns product if found", async () => {
            product_model_1.default.findById.mockResolvedValue(mockProduct);
            const result = await productService.getproduct("prod123");
            expect(result).toEqual(mockProduct);
        });
    });
    describe("updateProduct", () => {
        it("throws 404 if product not found", async () => {
            product_model_1.default.findByIdAndUpdate.mockResolvedValue(null);
            await expect(productService.updateProduct("prod123", { name: "Updated" })).rejects.toThrow((0, http_errors_1.default)(404));
        });
        it("updates product successfully", async () => {
            product_model_1.default.findByIdAndUpdate.mockResolvedValue(mockProduct);
            const result = await productService.updateProduct("prod123", { name: "Updated" });
            expect(product_model_1.default.findByIdAndUpdate).toHaveBeenCalledWith("prod123", { name: "Updated" }, { new: true });
            expect(result).toEqual(mockProduct);
        });
    });
    describe("deleteProduct", () => {
        it("throws 404 if product not found", async () => {
            product_model_1.default.findByIdAndDelete.mockResolvedValue(null);
            await expect(productService.deleteProduct("prod123")).rejects.toThrow((0, http_errors_1.default)(404));
        });
        it("deletes product successfully", async () => {
            product_model_1.default.findByIdAndDelete.mockResolvedValue(mockProduct);
            const result = await productService.deleteProduct("prod123");
            expect(product_model_1.default.findByIdAndDelete).toHaveBeenCalledWith("prod123");
            expect(result).toEqual(mockProduct);
        });
    });
});
