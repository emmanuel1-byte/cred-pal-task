import express, { Request, Response } from "express";
import {
  routeNotFoundErrorHandler,
  globalErrorHandler,
} from "./src/middlewares/error";
import product from "./src/module/product/product.route";
import cors from "cors";
import auth from "./src/module/authentication/auth.route";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "API is running...." });
});

app.use("/api/v1/auth", auth);
app.use("/api/v1/products", product);

app.use(routeNotFoundErrorHandler);
app.use(globalErrorHandler);

export default app;
