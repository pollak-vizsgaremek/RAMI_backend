import { Router } from "express";
import { authorize } from "../middleware/apiKey.middleware";
import errorMiddleware from "../middleware/error.middleware";
import { getSchoolNames, registerSchool } from "../controllers/school/school.controller";

const schoolRouter = Router();

// Return list of schools with id and name
schoolRouter.get('/names', getSchoolNames);

// Register a new school
schoolRouter.post('/register', registerSchool);

export default schoolRouter;