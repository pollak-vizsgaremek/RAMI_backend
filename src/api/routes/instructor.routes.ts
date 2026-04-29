import { Router } from "express";
import { authorize, authorize_school } from "../middleware/apiKey.middleware";
import errorMiddleware from "../middleware/error.middleware";
import {
  deleteInstructor,
  getInstructorById,
  getInstructors,
  updateInstructor,
  searchInstructors,
  nominateInstructor,
  acceptStudent,
  getMyStudents,
  rejectStudent,
  checkNominationStatus,
  getCitiesWithInstructorsCount,
} from "../controllers/instructor/instructor.controller";
import { getLeaderboard, getTopInstructor } from "../controllers/instructor/leaderboard.controller";
import { uploadInstructorProfileImage } from "../controllers/instructor/instructor.controller";

const instructorRouter = Router();

// GET all users
instructorRouter.get("/", getInstructors);

// GET search results
// IMPORTANT: This must stay ABOVE the "/:id" route so Express knows you want the search function, not an instructor with the ID of "search"
instructorRouter.get("/search", searchInstructors);
instructorRouter.get("/cities", getCitiesWithInstructorsCount);
instructorRouter.get("/leaderboard", getLeaderboard);
instructorRouter.get("/top", getTopInstructor);

// GET, PUT, DELETE by ID
instructorRouter.get("/:id", getInstructorById);
instructorRouter.put("/:id", updateInstructor);
instructorRouter.delete("/:id", deleteInstructor);
instructorRouter.post('/:id/nominate', nominateInstructor);
instructorRouter.post('/:id/accept-student', acceptStudent);
instructorRouter.get('/:id/my-students', getMyStudents);
instructorRouter.get('/:id/nomination-status/:userId', checkNominationStatus);
instructorRouter.post('/:id/reject-student', rejectStudent);
instructorRouter.post('/:id/profile-image', authorize_school, uploadInstructorProfileImage);


export default instructorRouter;
