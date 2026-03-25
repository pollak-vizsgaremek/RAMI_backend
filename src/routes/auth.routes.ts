import { Router } from "express";
import errorMiddleware from "../middleware/error.middleware";
import { login, register } from "../controller/auth.controller";



const authRouter = Router();


authRouter.post('/register', register);

authRouter.post('/login', login);


export default authRouter;