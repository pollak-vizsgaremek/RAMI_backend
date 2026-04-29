import { Router } from "express";
import { authorize } from "../middleware/apiKey.middleware";
import errorMiddleware from "../middleware/error.middleware";
import {
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
  nominateInstructor,
  getUserInstructors,
  uploadUserProfileImage,
} from "../controllers/user/user.controller";

const userRouter = Router();

userRouter.get("/", errorMiddleware, getUsers);
userRouter.get("/:id", authorize, errorMiddleware, getUserById);
userRouter.get("/:id/instructors", authorize, errorMiddleware, getUserInstructors);
userRouter.put("/:id", authorize, errorMiddleware, updateUser);
userRouter.delete("/:id", authorize, errorMiddleware, deleteUser);
userRouter.post(
  "/:id/nominate",
  authorize,
  errorMiddleware,
  nominateInstructor,
);
userRouter.post("/:id/profile-image", authorize, errorMiddleware, uploadUserProfileImage);

export default userRouter;
