import createHttpError from "http-errors";
import Product, { IProduct } from "./product.model";

export class ProductService {
  async createProduct(data: IProduct) {
    const existingProduct = await Product.findOne({ name: data.name });
    if (existingProduct) {
      throw createHttpError(409, "Product already exists");
    }
    const newProduct = await Product.create({ ...data });
    return newProduct;
  }

  async listProducts(page: number, limit: number, searchQuery: string) {
    const query = searchQuery
      ? { name: { $regex: `^${searchQuery}`, $options: "i" } }
      : {};

    const [products, productCount] = await Promise.all([
      Product.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Product.countDocuments(query),
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

  async getproduct(productId: string) {
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      throw createHttpError(404, "Product not found");
    }
    return existingProduct;
  }

  async updateProduct(productId: string, payload: any) {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { ...payload },
      { new: true },
    );
    if (!updatedProduct) {
      throw createHttpError(404, "Product not found");
    }
    return updatedProduct;
  }

  async deleteProduct(productId: string) {
    const existingProduct = await Product.findByIdAndDelete(productId);
    if (!existingProduct) {
      throw createHttpError(404, "Product not found");
    }
    return existingProduct;
  }
}
