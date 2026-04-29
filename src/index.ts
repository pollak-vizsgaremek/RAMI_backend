import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import userRouter from "./api/routes/user.routes";
import reviewRouter from "./api/routes/review.routes";
import schoolRouter from "./api/routes/school.routes";
import instructorRouter from "./api/routes/instructor.routes";
import authRouter from "./api/routes/auth.routes";
import adminRouter from "./api/routes/admin.routes";
import categoriesRouter from "./api/routes/categories.routes";
import reportRouter from "./api/routes/report.routes";

import { connectDatabase } from "./core/database/mongodb";

import { recalculateAllRatings } from "./core/services/ratingCron.service";

dotenv.config();
const PORT = process.env.PORT;
const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://100.102.77.3:5173",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/school", schoolRouter);
app.use("/api/v1/instructor", instructorRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/report", reportRouter);

let expressServer: any = null;
let isConnected = false;

export const startServer = async () => {
  if (!expressServer) {
    if (!isConnected) {
      await connectDatabase();
      isConnected = true;
    }
    return new Promise((resolve) => {
      expressServer = app.listen(PORT, () => {
        console.log(`App started at http://localhost:${PORT}`);

        recalculateAllRatings();
        setInterval(recalculateAllRatings, 60 * 60 * 1000);

        resolve(expressServer);
      });
    });
  }
  return expressServer;
};

export const closeServer = async () => {
  if (expressServer) {
    return new Promise<void>((resolve, reject) => {
      expressServer.close(async (err: any) => {
        if (err) reject(err);
        try {
          expressServer = null;
          if (isConnected && mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
            isConnected = false;
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }
};

if (process.env.NODE_ENV !== "test") {
  startServer().catch(console.error);
}

export default app;