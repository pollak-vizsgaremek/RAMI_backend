import { Router } from "express";
import { authorize } from "../middleware/apiKey.middleware";
import errorMiddleware from "../middleware/error.middleware";


import {
  getReviews,
  createReview,
  deleteReview,
  getInstructorReviews,
  getMyReviews,
  toggleHelpfulReview,
} from "../controllers/review/review.controller";

const reviewRouter = Router();


reviewRouter.get("/", getReviews);


reviewRouter.post("/create", createReview);
reviewRouter.get("/instructor/:id", getInstructorReviews);
reviewRouter.get("/user/:userId", getMyReviews);


reviewRouter.put("/:id/helpful", toggleHelpfulReview);
reviewRouter.delete("/:id", deleteReview);

export default reviewRouter;
