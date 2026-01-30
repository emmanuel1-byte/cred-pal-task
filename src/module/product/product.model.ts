import { model, Schema } from "mongoose";

export interface IProduct {
  name: string;
  price: number;
  stock: number;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, unique: true, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
  },
  { timestamps: true },
);

const Product = model<IProduct>("products", productSchema);

export default Product;
