import { Router } from "express";
import { verifyAdminToken, verifyToken } from "../middleware/admin.middleware";
import errorMiddleware from "../middleware/error.middleware";
import { getSchoolNames, registerSchool, getSchools, updateSchool, deleteSchool, getSchoolById, publicRegisterSchool } from "../controllers/school/school.controller";

const schoolRouter = Router();

schoolRouter.get('/names', getSchoolNames);
schoolRouter.get('/', getSchools);
schoolRouter.get('/:id', getSchoolById);
schoolRouter.post('/public-register', publicRegisterSchool);
schoolRouter.post('/register', verifyAdminToken, registerSchool);
schoolRouter.put('/:id', verifyToken, updateSchool);
schoolRouter.delete('/:id', verifyAdminToken, deleteSchool);

export default schoolRouter;