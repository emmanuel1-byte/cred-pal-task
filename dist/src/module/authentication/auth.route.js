"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const auth = express_1.default.Router();
const authController = new auth_controller_1.AuthController();
auth.post("/signup", authController.signup);
auth.post("/login", authController.login);
exports.default = auth;
