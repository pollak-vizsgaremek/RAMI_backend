import { Router } from "express";
import {
  register,
  verifyEmail,
  registerInstructor,
} from "../controllers/auth/register.controller";
import {
  generateAdminRegistrationCode,
  registerAdmin,
  validateRegistrationCode,
  getActiveRegistrationCodes,
  revokeRegistrationCode,
} from "../controllers/auth/adminRegister.controller";
import { login } from "../controllers/auth/login.controller";
import { forgotPassword } from "../controllers/auth/forgotPassword.controller";
import { resetPassword } from "../controllers/auth/resetPassword.controller";
import { authIpRateLimiter } from "../middleware/rateLimit.middleware";
import { verifyAdminToken } from "../middleware/admin.middleware";

const router = Router();

// Regular auth routes
router.post("/register", register);
router.get("/verify/:token", verifyEmail);
router.post("/login", login);
router.post("/forgot-password", authIpRateLimiter, forgotPassword);
router.post("/reset-password", authIpRateLimiter, resetPassword);
router.post("/register-instructor", registerInstructor);

// Admin registration routes
router.post("/admin/register", registerAdmin);
router.get("/admin/validate-code/:code", validateRegistrationCode);
router.post(
  "/admin/generate-code",
  verifyAdminToken,
  generateAdminRegistrationCode,
);
router.get("/admin/codes", verifyAdminToken, getActiveRegistrationCodes);
router.delete("/admin/codes/:code", verifyAdminToken, revokeRegistrationCode);

export default router;
