import { Router } from "express";
import { authorize } from "../middleware/apiKey.middleware";
import errorMiddleware from "../middleware/error.middleware";
import {  getReviews, createReview, deleteReview} from "../controller/reviwe.controller";

const reviewRouter = Router();

reviewRouter.get("/", getReviews);
reviewRouter.post("/newreview", createReview);
reviewRouter.delete("/:id", deleteReview);

export default reviewRouter;