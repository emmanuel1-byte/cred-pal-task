"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("./product.controller");
const authenticate_jwt_1 = require("../../middlewares/authenticate-jwt");
const product = express_1.default.Router();
const productController = new product_controller_1.ProductController();
product.post("/", authenticate_jwt_1.authenticateJWT, productController.createProduct);
product.patch("/:id", authenticate_jwt_1.authenticateJWT, productController.updateProduct);
product.get("/", authenticate_jwt_1.authenticateJWT, productController.listProducts);
product.get("/:id", authenticate_jwt_1.authenticateJWT, productController.getProduct);
product.delete("/:id", authenticate_jwt_1.authenticateJWT, productController.deleteProduct);
exports.default = product;
