import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "node:fs";
import path from "node:path";
import authRoutes from "@route/v1/auth";
import apiRoutes from "@route/v1/route";
import { authMiddleware } from "@middleware/auth.middleware";
import { serve, setup } from "swagger-ui-express";
import { logger } from "@utils/logger";
import "dotenv/config";

const PORT = process.env.PORT || 5000;

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type, Authorization"
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const specs = JSON.parse(
  fs.readFileSync(path.join(__dirname, "swagger.json"), "utf8")
);

app.use("/docs/v1", serve, setup(specs));

app.use((req, res, next) => {
  next();
});

app.use("/auth/v1", authRoutes);

app.use("/api/v1", authMiddleware, apiRoutes);

app.use((_, res) => {
  res.status(404).json({
    code: 404,
    message: "Not Found",
    errors: "Resource not found"
  });
});

app.listen(PORT, () => {
  console.log(
    `Server running on ${process.env.NODE_ENV} environment at port ::${PORT}`
  );
});
