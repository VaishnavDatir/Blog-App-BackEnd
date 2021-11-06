import Router from "express";

import UserController from "../controllers/user.controller";

import { body } from "express-validator";

import isAuth from "../middleware/is_auth.middleware";

const userRouter = Router();

//view userProfile
userRouter.get("/view_user/:userId", isAuth, UserController.viewUser);

//Delete User
userRouter.get("/deleteUser", isAuth, UserController.deleteUser);

userRouter.get(
  "/userFollowUnfollow/:userId",
  isAuth,
  UserController.setUserFollowOther
);

userRouter.post("/updateUser", isAuth, UserController.updateUserProfile);

userRouter.get(
  "/getUserFollowers/:userId",
  isAuth,
  UserController.getUserFollowers
);

userRouter.get(
  "/getUserFollowings/:userId",
  isAuth,
  UserController.getUserFollowings
);
export { userRouter };
