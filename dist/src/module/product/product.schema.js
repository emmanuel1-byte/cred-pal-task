"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productParamSchema = exports.productQuerySchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string(),
    price: zod_1.z.number(),
    stock: zod_1.z.number(),
});
exports.updateProductSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    price: zod_1.z.number().optional(),
    stock: zod_1.z.number().optional(),
});
exports.productQuerySchema = zod_1.z.object({
    search: zod_1.z.string().optional().default(""),
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10),
});
exports.productParamSchema = zod_1.z.object({
    id: zod_1.z.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId",
    }),
});
