"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const logger_1 = __importDefault(require("./logger"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
async function connectDatabase() {
    try {
        await (0, mongoose_1.connect)(process.env.MONGO_URI);
        logger_1.default.info("Database connection successfull");
    }
    catch (err) {
        logger_1.default.error(err);
        throw new Error(err);
    }
}
exports.default = connectDatabase;
