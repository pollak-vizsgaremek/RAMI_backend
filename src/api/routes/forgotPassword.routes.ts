import { Router } from "express";
import { forgotPassword } from "../controllers/auth/forgotPassword.controller";

const forgotPasswordRouter = Router();


forgotPasswordRouter.post("/forgot-password", forgotPassword);

export default forgotPasswordRouter;
