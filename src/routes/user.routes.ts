import { Router } from "express";
import { authorize } from "../middleware/apiKey.middleware";
import errorMiddleware from "../middleware/error.middleware";
import { deleteUser, getUserById, getUsers, updateUser } from "../controller/user.controller";


const userRouter = Router();

userRouter.get("/", authorize, errorMiddleware ,getUsers);
userRouter.get("/:id", authorize, errorMiddleware ,getUserById);
userRouter.put("/:id", authorize, errorMiddleware ,updateUser);
userRouter.delete("/:id", authorize, errorMiddleware ,deleteUser);

export default userRouter;