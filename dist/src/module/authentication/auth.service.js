"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const auth_model_1 = __importDefault(require("./auth.model"));
const http_errors_1 = __importDefault(require("http-errors"));
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = require("jsonwebtoken");
class AuthService {
    async signup(data) {
        const existingUser = await auth_model_1.default.findOne({ email: data.email });
        if (existingUser) {
            throw (0, http_errors_1.default)(409, "User aleady exist");
        }
        const newUser = await auth_model_1.default.create({
            ...data,
            password: await bcrypt.hash(data.password, 10),
        });
        return {
            user: newUser,
        };
    }
    async login(data) {
        const existingUser = await auth_model_1.default.findOne({ email: data.email });
        if (!existingUser) {
            throw (0, http_errors_1.default)(404, "Invalid credentials");
        }
        const comparePassword = await bcrypt.compare(data.password, existingUser.password);
        if (!comparePassword) {
            return (0, http_errors_1.default)(401, "Invalid credentials");
        }
        const accessToken = this.generateToken(existingUser.id);
        return {
            user: existingUser,
            accessToken,
        };
    }
    generateToken(userId) {
        const payload = { sub: userId };
        const accessToken = (0, jsonwebtoken_1.sign)(payload, process.env.JWT_SECRET, {
            expiresIn: "2 days",
        });
        return accessToken;
    }
}
exports.AuthService = AuthService;
