"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const is_auth_middleware_1 = __importDefault(require("../middleware/is_auth.middleware"));
const userRouter = (0, express_1.default)();
exports.userRouter = userRouter;
//view userProfile
userRouter.get("/view_user/:userId", is_auth_middleware_1.default, user_controller_1.default.viewUser);
//Delete User
userRouter.get("/deleteUser", is_auth_middleware_1.default, user_controller_1.default.deleteUser);
userRouter.get("/userFollowUnfollow/:userId", is_auth_middleware_1.default, user_controller_1.default.setUserFollowOther);
userRouter.post("/updateUser", is_auth_middleware_1.default, user_controller_1.default.updateUserProfile);
userRouter.get("/getUserFollowers/:userId", is_auth_middleware_1.default, user_controller_1.default.getUserFollowers);
userRouter.get("/getUserFollowings/:userId", is_auth_middleware_1.default, user_controller_1.default.getUserFollowings);
