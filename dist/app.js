"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_1 = require("./src/middlewares/error");
const product_route_1 = __importDefault(require("./src/module/product/product.route"));
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = __importDefault(require("./src/module/authentication/auth.route"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.status(200).json({ success: true, message: "API is running...." });
});
app.use("/api/v1/auth", auth_route_1.default);
app.use("/api/v1/products", product_route_1.default);
app.use(error_1.routeNotFoundErrorHandler);
app.use(error_1.globalErrorHandler);
exports.default = app;
