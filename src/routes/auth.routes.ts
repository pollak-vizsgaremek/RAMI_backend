import { Router } from "express";
import { register, verifyEmail, registerInstructor } from "../controller/auth/register.controller";
import { login } from "../controller/auth/login.controller";
import { forgotPassword } from "../controller/auth/forgotPassword.controller";
import { resetPassword } from "../controller/auth/resetPassword.controller";

const router = Router();

router.post("/register", register);
router.get("/verify/:token", verifyEmail);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/register-instructor", registerInstructor);

export default router;
