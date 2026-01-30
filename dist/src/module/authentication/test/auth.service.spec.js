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
const auth_service_1 = require("../auth.service");
const auth_model_1 = __importDefault(require("../auth.model"));
const http_errors_1 = __importDefault(require("http-errors"));
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = require("jsonwebtoken");
jest.mock("../auth.model");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
const mockUser = {
    id: "user123",
    email: "test@example.com",
    password: "hashedpassword",
};
describe("AuthService", () => {
    let authService;
    beforeEach(() => {
        authService = new auth_service_1.AuthService();
        jest.clearAllMocks();
    });
    describe("signup", () => {
        it("throws 409 if user already exists", async () => {
            auth_model_1.default.findOne.mockResolvedValue(mockUser);
            await expect(authService.signup({ email: "test@example.com", password: "pass123" }))
                .rejects.toThrow((0, http_errors_1.default)(409));
        });
        it("creates a new user and returns user object", async () => {
            auth_model_1.default.findOne.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue("hashedpass");
            auth_model_1.default.create.mockResolvedValue(mockUser);
            const result = await authService.signup({ email: "test@example.com", password: "pass123" });
            expect(bcrypt.hash).toHaveBeenCalledWith("pass123", 10);
            expect(auth_model_1.default.create).toHaveBeenCalledWith({ email: "test@example.com", password: "hashedpass" });
            expect(result).toEqual({ user: mockUser });
        });
    });
    describe("login", () => {
        it("throws 404 if user does not exist", async () => {
            auth_model_1.default.findOne.mockResolvedValue(null);
            await expect(authService.login({ email: "test@example.com", password: "pass123" }))
                .rejects.toThrow((0, http_errors_1.default)(404));
        });
        it("returns 401 if password does not match", async () => {
            auth_model_1.default.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);
            const result = await authService.login({ email: "test@example.com", password: "wrongpass" });
            expect(result).toEqual((0, http_errors_1.default)(401, "Invalid credentials"));
        });
        it("returns user and token if login succeeds", async () => {
            auth_model_1.default.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jsonwebtoken_1.sign.mockReturnValue("token123");
            const result = await authService.login({ email: "test@example.com", password: "pass123" });
            expect(bcrypt.compare).toHaveBeenCalledWith("pass123", mockUser.password);
            expect(jsonwebtoken_1.sign).toHaveBeenCalledWith({ sub: mockUser.id }, process.env.JWT_SECRET, { expiresIn: "2 days" });
            expect(result).toEqual({ user: mockUser, accessToken: "token123" });
        });
    });
    describe("generateToken", () => {
        it("generates JWT token with correct payload and secret", () => {
            jsonwebtoken_1.sign.mockReturnValue("token123");
            const token = authService.generateToken("user123");
            expect(token).toBe("token123");
            expect(jsonwebtoken_1.sign).toHaveBeenCalledWith({ sub: "user123" }, process.env.JWT_SECRET, { expiresIn: "2 days" });
        });
    });
});
