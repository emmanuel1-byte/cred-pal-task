import express from "express";
import { AuthController } from "./auth.controller";
const auth = express.Router();

const authController = new AuthController();

auth.post("/signup", authController.signup);

auth.post("/login", authController.login);

export default auth;
