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

// Your original routes
reviewRouter.get("/", getReviews);
reviewRouter.post("/newreview", createReview);
reviewRouter.delete("/:id", deleteReview);

// The new routes for the profile pages
reviewRouter.get("/instructor/:id", getInstructorReviews);
reviewRouter.get("/user/:userId", getMyReviews);

reviewRouter.put("/:id/helpful", toggleHelpfulReview);

export default reviewRouter;
