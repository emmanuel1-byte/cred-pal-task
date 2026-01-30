import { AuthService } from "../auth.service";
import User, { IUser } from "../auth.model";
import createError from "http-errors";
import * as bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

jest.mock("../auth.model");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const mockUser = {
  id: "user123",
  email: "test@example.com",
  password: "hashedpassword",
};

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe("signup", () => {
    it("throws 409 if user already exists", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      await expect(authService.signup({ email: "test@example.com", password: "pass123" } as IUser))
        .rejects.toThrow(createError(409));
    });

    it("creates a new user and returns user object", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpass");
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.signup({ email: "test@example.com", password: "pass123" } as IUser);

      expect(bcrypt.hash).toHaveBeenCalledWith("pass123", 10);
      expect(User.create).toHaveBeenCalledWith({ email: "test@example.com", password: "hashedpass" });
      expect(result).toEqual({ user: mockUser });
    });
  });

  describe("login", () => {
    it("throws 404 if user does not exist", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      await expect(authService.login({ email: "test@example.com", password: "pass123" } as IUser))
        .rejects.toThrow(createError(404));
    });

    it("returns 401 if password does not match", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authService.login({ email: "test@example.com", password: "wrongpass" } as IUser);
      expect(result).toEqual(createError(401, "Invalid credentials"));
    });

    it("returns user and token if login succeeds", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (sign as jest.Mock).mockReturnValue("token123");

      const result = await authService.login({ email: "test@example.com", password: "pass123" } as IUser);

      expect(bcrypt.compare).toHaveBeenCalledWith("pass123", mockUser.password);
      expect(sign).toHaveBeenCalledWith({ sub: mockUser.id }, process.env.JWT_SECRET, { expiresIn: "2 days" });
      expect(result).toEqual({ user: mockUser, accessToken: "token123" });
    });
  });

  describe("generateToken", () => {
    it("generates JWT token with correct payload and secret", () => {
      (sign as jest.Mock).mockReturnValue("token123");
      const token = (authService as any).generateToken("user123");
      expect(token).toBe("token123");
      expect(sign).toHaveBeenCalledWith({ sub: "user123" }, process.env.JWT_SECRET, { expiresIn: "2 days" });
    });
  });
});
