import {Router} from "express";
import {protectRoute} from "../middleware/auth.middleware.js";
import {getProfile} from "../controllers/user.controller.js";

const userRouter = new Router();

userRouter.get('/profile', protectRoute, getProfile);

export default userRouter;
