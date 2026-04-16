import { Router } from "express";
import { verifyAdminToken } from "../middleware/admin.middleware";
import {
  // Users
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  banUser,
  // Instructors
  getAllInstructors,
  getInstructorById,
  approveInstructor,
  rejectInstructor,
  deleteInstructor,
  // Reviews
  getAllReviews,
  getReviewById,
  approveReview,
  rejectReview,
  deleteReview,
  // Reports
  getAllReports,
  resolveReport,
  // Settings & Analytics
  getSystemSettings,
  updateSystemSettings,
  getAnalytics,
} from "../controllers/admin/admin.controller";

const router = Router();

// Apply admin verification middleware to all admin routes
router.use(verifyAdminToken);

// ═════════════════════════════════════════════════════════════════════════════
// USERS ROUTES
// ═════════════════════════════════════════════════════════════════════════════

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.post("/users/:id/ban", banUser);

// ═════════════════════════════════════════════════════════════════════════════
// INSTRUCTORS ROUTES
// ═════════════════════════════════════════════════════════════════════════════

router.get("/instructors", getAllInstructors);
router.get("/instructors/:id", getInstructorById);
router.post("/instructors/:id/approve", approveInstructor);
router.post("/instructors/:id/reject", rejectInstructor);
router.delete("/instructors/:id", deleteInstructor);

// ═════════════════════════════════════════════════════════════════════════════
// REVIEWS ROUTES
// ═════════════════════════════════════════════════════════════════════════════

router.get("/reviews", getAllReviews);
router.get("/reviews/:id", getReviewById);
router.post("/reviews/:id/approve", approveReview);
router.post("/reviews/:id/reject", rejectReview);
router.delete("/reviews/:id", deleteReview);

// ═════════════════════════════════════════════════════════════════════════════
// REPORTS ROUTES
// ═════════════════════════════════════════════════════════════════════════════

router.get("/reports", getAllReports);
router.post("/reports/:id/resolve", resolveReport);

// ═════════════════════════════════════════════════════════════════════════════
// SETTINGS & ANALYTICS ROUTES
// ═════════════════════════════════════════════════════════════════════════════

router.get("/settings", getSystemSettings);
router.put("/settings", updateSystemSettings);
router.get("/analytics", getAnalytics);

export default router;
