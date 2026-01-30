"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeNotFoundErrorHandler = routeNotFoundErrorHandler;
exports.globalErrorHandler = globalErrorHandler;
const logger_1 = __importDefault(require("../utils/logger"));
const zod_1 = require("zod");
const http_errors_1 = __importDefault(require("http-errors"));
function routeNotFoundErrorHandler(req, res, next) {
    res.status(404).json({
        success: false,
        message: "The requested endpoint does not exist",
    });
    next();
}
function globalErrorHandler(err, req, res, next) {
    logger_1.default.error({
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
    });
    if (res.headersSent) {
        return next(err);
    }
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: err.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    }
    if (http_errors_1.default.isHttpError(err)) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    const isProduction = process.env.NODE_ENV === "production";
    return res.status(500).json({
        success: false,
        message: isProduction ? "Internal server error" : err.message,
        ...(isProduction ? {} : { stack: err.stack }),
    });
}
