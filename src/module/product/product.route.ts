import express from "express";
import { ProductController } from "./product.controller";
import { authenticateJWT } from "../../middlewares/authenticate-jwt";
const product = express.Router();

const productController = new ProductController();

product.post("/", authenticateJWT, productController.createProduct);

product.patch("/:id", authenticateJWT, productController.updateProduct);

product.get("/", authenticateJWT, productController.listProducts);

product.get("/:id", authenticateJWT, productController.getProduct);

product.delete("/:id", authenticateJWT, productController.deleteProduct);

export default product;
