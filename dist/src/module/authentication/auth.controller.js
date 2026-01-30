"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const logger_1 = __importDefault(require("../../utils/logger"));
const auth_schema_1 = require("./auth.schema");
class AuthController {
    constructor() {
        this.authService = new auth_service_1.AuthService();
        this.signup = async (req, res, next) => {
            try {
                // validate incoming req payload
                const validatedRequestPayload = auth_schema_1.userSchema.parse(req.body);
                const user = await this.authService.signup(validatedRequestPayload);
                return res.status(201).json({
                    success: true,
                    message: "Signup successful",
                    data: user,
                });
            }
            catch (error) {
                logger_1.default.error(`Signup failed: ${error}`);
                next(error);
            }
        };
        this.login = async (req, res, next) => {
            try {
                // validate incoming req payload
                const validatedRequestPayload = auth_schema_1.userSchema.parse(req.body);
                const user = await this.authService.login(validatedRequestPayload);
                return res.status(201).json({
                    success: true,
                    message: "Login successful",
                    data: user,
                });
            }
            catch (error) {
                logger_1.default.error(`Login failed: ${error}`);
                next(error);
            }
        };
    }
}
exports.AuthController = AuthController;
