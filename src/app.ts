import mongoose from "mongoose";
mongoose.set("strict", "throw");

import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import cors from "cors";

import { appError } from "./core/utils/appError";
import { globalHandler } from "./core/utils/globalHandler";
import "./corn-job";

import { devMode } from "./config/appConfig";

import cookieParser from "cookie-parser";
import path from "path";
import { devMiddleware } from "./core/middleware/devMiddleware";
import authRouter from "./modules/auth/auth.route";
import eventRouter from "./modules/event/event.router";
import bookingRouter from "./modules/booking/booking.routes";

export const app = express();

dotenv.config({ path: "./.env" });

// dev logs
if (devMode) app.use(morgan("dev"));
// security
app.use(helmet());
app.use(hpp());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  message: "Too many requests from this IP , please try again in an hour!",
});
if (!devMode) app.use(limiter);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
// custom middleware

if (devMode) app.use(devMiddleware);

//  Routes
app.get("/", (_req, res) => {
  res.status(200).json({ status: "success" });
});
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/event", eventRouter);
app.use("/api/v1/booking", bookingRouter);

app.all(/(.*)/, (req, _res, next) => {
  next(
    new appError(
      `Can't find ${req.originalUrl} on this server!`,
      404,
      "INVALID_ROUTE",
    ),
  );
});

app.use(globalHandler);

export default app;
