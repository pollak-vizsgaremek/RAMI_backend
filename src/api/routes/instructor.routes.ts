import { Router } from "express";
import { authorize } from "../middleware/apiKey.middleware"; // Leave this if you plan to use it later!
import errorMiddleware from "../middleware/error.middleware";
import {
  deleteInstructor,
  getInstructorById,
  getInstructors,
  updateInstructor,
  searchInstructors,
  nominateInstructor,
  acceptStudent,
  
} from "../controllers/instructor/instructor.controller";

const instructorRouter = Router();

// GET all users
instructorRouter.get("/", getInstructors);

// GET search results
// IMPORTANT: This must stay ABOVE the "/:id" route so Express knows you want the search function, not an instructor with the ID of "search"
instructorRouter.get("/search", searchInstructors);

// GET, PUT, DELETE by ID
instructorRouter.get("/:id", getInstructorById);
instructorRouter.put("/:id", updateInstructor);
instructorRouter.delete("/:id", deleteInstructor);
instructorRouter.post('/:id/nominate', nominateInstructor);
instructorRouter.post('/:id/accept-student', acceptStudent);


export default instructorRouter;
