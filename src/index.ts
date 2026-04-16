// Server imports
import e from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

//-- API Routes imports
import userRouter from "./api/routes/user.routes";
import reviewRouter from "./api/routes/review.routes";
import schoolRouter from "./api/routes/school.routes";
import instructorRouter from "./api/routes/instructor.routes";
import authRouter from "./api/routes/auth.routes";
import adminRouter from "./api/routes/admin.routes";

//-- Database connection import for checking connection
import { connectDatabase } from "./core/database/mongodb";

//-- dotenv config
dotenv.config();
const PORT = process.env.PORT;
const app = e();

//-- Cors settings
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(e.json());

//-- API Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/school", schoolRouter);
app.use("/api/v1/instructor", instructorRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);

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

// Only start server if not in test environment
if (process.env.NODE_ENV !== "test") {
  startServer().catch(console.error);
}

export default app;
