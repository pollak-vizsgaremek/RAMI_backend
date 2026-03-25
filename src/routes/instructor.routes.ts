import { Router } from "express";
import { authorize } from "../middleware/apiKey.middleware";
import errorMiddleware from "../middleware/error.middleware";
import { deleteUser, getUserById, getUsers, updateUser } from "../controller/instructor.controller";
const instructorRouter = Router();

instructorRouter.get("/", getUsers )

export default instructorRouter;