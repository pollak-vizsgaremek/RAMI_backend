import { Router } from "express";
import { verifyAdminToken } from "../middleware/admin.middleware";
import {

  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  banUser,

  getAllInstructors,
  getInstructorById,
  approveInstructor,
  rejectInstructor,
  deleteInstructor,

  getAllReviews,
  getReviewById,
  approveReview,
  rejectReview,
  deleteReview,

  getAllReports,
  resolveReport,

  getSystemSettings,
  updateSystemSettings,
  getAnalytics,
} from "../controllers/admin/admin.controller";

const router = Router();


router.use(verifyAdminToken);




router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.post("/users/:id/ban", banUser);




router.get("/instructors", getAllInstructors);
router.get("/instructors/:id", getInstructorById);
router.post("/instructors/:id/approve", approveInstructor);
router.post("/instructors/:id/reject", rejectInstructor);
router.delete("/instructors/:id", deleteInstructor);




router.get("/reviews", getAllReviews);
router.get("/reviews/:id", getReviewById);
router.post("/reviews/:id/approve", approveReview);
router.post("/reviews/:id/reject", rejectReview);
router.delete("/reviews/:id", deleteReview);




router.get("/reports", getAllReports);
router.post("/reports/:id/resolve", resolveReport);




router.get("/settings", getSystemSettings);
router.put("/settings", updateSystemSettings);
router.get("/analytics", getAnalytics);

export default router;
