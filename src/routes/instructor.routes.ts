import { Router } from "express";
import { authorize } from "../middleware/apiKey.middleware";
import errorMiddleware from "../middleware/error.middleware";
const instructorRouter = Router();

export default instructorRouter;