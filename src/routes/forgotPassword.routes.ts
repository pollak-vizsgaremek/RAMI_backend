import { Router } from "express";
import { forgotPassword } from "../controller/auth/forgotPassword.controller"; // Adjust path

const forgotPasswordRouter = Router();

// This creates the POST endpoint at /api/auth/forgot-password (depending on how you mount it)
forgotPasswordRouter.post("/forgot-password", forgotPassword);

export default forgotPasswordRouter;
