// Server imports
import e from "express";
import dotenv from "dotenv";
import cors from "cors";


//-- Routes imports
import userRouter from "./routes/user.routes";
import reviewRouter from "./routes/reviwe.routes";
import schoolRouter from "./routes/school.routes";
import instructorRouter from "./routes/instructor.routes";
import authRouter from "./routes/auth.routes";


//-- Database connection import for checking connection
import { connectDatabase } from "./database/mongodb";


//-- dotenv config
dotenv.config();
const PORT = process.env.PORT;
const app = e();

//-- Cors settings
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(e.json());



//app.use("/api/v1/licencePlate", apiKeyMiddleware, licencePlateController);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/school", schoolRouter);
app.use("/api/v1/instructor", instructorRouter);
app.use("/api/v1/auth", authRouter);



const expressServer = app.listen(PORT, async () => {
  console.log(`App started at http://localhost:${PORT}`);

  await connectDatabase();
});