import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

import { router as userRouter } from "./routes/user.routes.js";
import { router as packageRouter } from "./routes/package.routes.js";
import { router as reviewRouter } from "./routes/review.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/packages", packageRouter);
app.use("/api/v1/review", reviewRouter);
export { app };
