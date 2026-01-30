import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import logger from "../../utils/logger";
import { userSchema } from "./auth.schema";

export class AuthController {
  private readonly authService = new AuthService();

  signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // validate incoming req payload
      const validatedRequestPayload = userSchema.parse(req.body);

      const user = await this.authService.signup(validatedRequestPayload);

      return res.status(201).json({
        success: true,
        message: "Signup successful",
        data: user,
      });
    } catch (error) {
      logger.error(`Signup failed: ${error}`);
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // validate incoming req payload
      const validatedRequestPayload = userSchema.parse(req.body);

      const user = await this.authService.login(validatedRequestPayload);

      return res.status(201).json({
        success: true,
        message: "Login successful",
        data: user,
      });
    } catch (error) {
      logger.error(`Login failed: ${error}`);
      next(error);
    }
  };
}
