import { Router } from "express";
import { authorize } from "../middleware/apiKey.middleware"; // Leave this if you plan to use it later!
import errorMiddleware from "../middleware/error.middleware";
import {
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
  searchInstructors,
} from "../controller/instructor.controller";

const instructorRouter = Router();

// GET all users
instructorRouter.get("/", getUsers);

// GET search results
// IMPORTANT: This must stay ABOVE the "/:id" route so Express knows you want the search function, not an instructor with the ID of "search"
instructorRouter.get("/search", searchInstructors);

// GET, PUT, DELETE by ID
instructorRouter.get("/:id", getUserById);
instructorRouter.put("/:id", updateUser);
instructorRouter.delete("/:id", deleteUser);

export default instructorRouter;
