import { ProductService } from "../product.service";
import Product, { IProduct } from "../product.model";
import createHttpError from "http-errors";

jest.mock("./product.model");

const mockProduct = {
  id: "prod123",
  name: "Test Product",
  createdAt: new Date(),
};

describe("ProductService", () => {
  let productService: ProductService;

  beforeEach(() => {
    productService = new ProductService();
    jest.clearAllMocks();
  });

  describe("createProduct", () => {
    it("throws 409 if product already exists", async () => {
      (Product.findOne as jest.Mock).mockResolvedValue(mockProduct);
      await expect(productService.createProduct({ name: "Test Product" } as IProduct))
        .rejects.toThrow(createHttpError(409));
    });

    it("creates a new product", async () => {
      (Product.findOne as jest.Mock).mockResolvedValue(null);
      (Product.create as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productService.createProduct({ name: "New Product" } as IProduct);

      expect(Product.create).toHaveBeenCalledWith({ name: "New Product" });
      expect(result).toEqual(mockProduct);
    });
  });

  describe("listProducts", () => {
    it("returns paginated products without search query", async () => {
      (Product.find as any).mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([mockProduct]),
      });
      (Product.countDocuments as jest.Mock).mockResolvedValue(1);

      const result = await productService.listProducts(1, 10, "");

      expect(result).toEqual({
        products: [mockProduct],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
      });
    });

    it("returns paginated products with search query", async () => {
      (Product.find as any).mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([mockProduct]),
      });
      (Product.countDocuments as jest.Mock).mockResolvedValue(1);

      const result = await productService.listProducts(1, 10, "Test");

      expect(Product.find).toHaveBeenCalledWith({ name: { $regex: "^Test", $options: "i" } });
      expect(result.meta.totalPages).toBe(1);
    });
  });

  describe("getproduct", () => {
    it("throws 404 if product not found", async () => {
      (Product.findById as jest.Mock).mockResolvedValue(null);
      await expect(productService.getproduct("prod123")).rejects.toThrow(createHttpError(404));
    });

    it("returns product if found", async () => {
      (Product.findById as jest.Mock).mockResolvedValue(mockProduct);
      const result = await productService.getproduct("prod123");
      expect(result).toEqual(mockProduct);
    });
  });

  describe("updateProduct", () => {
    it("throws 404 if product not found", async () => {
      (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
      await expect(productService.updateProduct("prod123", { name: "Updated" })).rejects.toThrow(createHttpError(404));
    });

    it("updates product successfully", async () => {
      (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockProduct);
      const result = await productService.updateProduct("prod123", { name: "Updated" });
      expect(Product.findByIdAndUpdate).toHaveBeenCalledWith("prod123", { name: "Updated" }, { new: true });
      expect(result).toEqual(mockProduct);
    });
  });

  describe("deleteProduct", () => {
    it("throws 404 if product not found", async () => {
      (Product.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
      await expect(productService.deleteProduct("prod123")).rejects.toThrow(createHttpError(404));
    });

    it("deletes product successfully", async () => {
      (Product.findByIdAndDelete as jest.Mock).mockResolvedValue(mockProduct);
      const result = await productService.deleteProduct("prod123");
      expect(Product.findByIdAndDelete).toHaveBeenCalledWith("prod123");
      expect(result).toEqual(mockProduct);
    });
  });
});
