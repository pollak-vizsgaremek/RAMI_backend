import { Router } from "express";
import { authorize } from "../middleware/apiKey.middleware";
import errorMiddleware from "../middleware/error.middleware";

// Import ALL FIVE functions from the controller perfectly
import {
  getReviews,
  createReview,
  deleteReview,
  getInstructorReviews,
  getMyReviews,
  toggleHelpfulReview,
} from "../controllers/review/review.controller";

const reviewRouter = Router();

// Get all reviews
reviewRouter.get("/", getReviews);

// Specific routes (must come BEFORE parameter routes /:id)
reviewRouter.post("/create", createReview);
reviewRouter.get("/instructor/:id", getInstructorReviews);
reviewRouter.get("/user/:userId", getMyReviews);

// Parameter-based routes (must come AFTER specific routes)
reviewRouter.put("/:id/helpful", toggleHelpfulReview);
reviewRouter.delete("/:id", deleteReview);

export default reviewRouter;
