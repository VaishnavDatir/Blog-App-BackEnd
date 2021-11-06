"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const post_model_1 = __importDefault(require("../models/post.model"));
const error_exception_1 = __importDefault(require("../exceptions/error.exception"));
const httpStatusCode_util_1 = __importDefault(require("../utils/httpStatusCode.util"));
class UserController {
    static viewUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const user = yield user_model_1.default.findById(userId)
                    .select("followers followings")
                    .populate("posts");
                if (!user) {
                    const error = new error_exception_1.default(httpStatusCode_util_1.default.NOT_FOUND, "User not found", -2);
                    return next(error);
                }
                const isThisMe = userId === req.userId;
                return res.status(httpStatusCode_util_1.default.OK).json({
                    success: true,
                    user,
                    isThisMe,
                    code: 1,
                });
            }
            catch (error) {
                console.log(error);
                const err = new error_exception_1.default(httpStatusCode_util_1.default.NOT_FOUND, "Internal Error Occured", -5);
                return next(err);
            }
        });
    }
    //delete User
    static deleteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findByIdAndDelete(req.userId).lean();
                if (!user) {
                    const error = new error_exception_1.default(httpStatusCode_util_1.default.NOT_FOUND, "User not found", -2);
                    return next(error);
                }
                yield post_model_1.default.deleteMany({
                    author: user === null || user === void 0 ? void 0 : user.id,
                });
                return res.status(httpStatusCode_util_1.default.OK).json({
                    success: true,
                    message: "The user has been deleted",
                    code: 1,
                });
            }
            catch (error) {
                console.log(error);
                const err = new error_exception_1.default(httpStatusCode_util_1.default.NOT_FOUND, "Internal Error Occured", -5);
                return next(err);
            }
        });
    }
    static setUserFollowOther(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const user = yield user_model_1.default.findById(userId).select("followers followings");
                if (user == null) {
                    const error = new error_exception_1.default(httpStatusCode_util_1.default.NOT_FOUND, "User not found", -2);
                    return next(error);
                }
                const me = (yield user_model_1.default.findById(req.userId).select("followers followings"));
                if (user.followers.includes(me.id)) {
                    const myIndex = me === null || me === void 0 ? void 0 : me.followings.indexOf(me);
                    me === null || me === void 0 ? void 0 : me.followings.splice(myIndex);
                    const userIndex = user === null || user === void 0 ? void 0 : user.followers.indexOf(me);
                    user === null || user === void 0 ? void 0 : user.followers.splice(userIndex);
                }
                else {
                    user === null || user === void 0 ? void 0 : user.followers.push(me);
                    me === null || me === void 0 ? void 0 : me.followings.push(user);
                }
                yield user.save();
                yield me.save();
                return res.status(httpStatusCode_util_1.default.OK).json({
                    success: true,
                    code: 1,
                });
            }
            catch (error) {
                console.log(error);
                const err = new error_exception_1.default(httpStatusCode_util_1.default.NOT_FOUND, "Internal Error Occured", -5);
                return next(err);
            }
        });
    }
    static updateUserProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findById(req.userId);
                if (user == null) {
                    const error = new error_exception_1.default(httpStatusCode_util_1.default.NOT_FOUND, "User not found", -2);
                    return next(error);
                }
                let { name, username, bio } = req.body;
                user.name = name;
                user.bio = bio;
                if (user.username != username) {
                    const usedUserName = yield user_model_1.default.exists({ username: username });
                    if (usedUserName) {
                        const error = new error_exception_1.default(httpStatusCode_util_1.default.NOT_FOUND, "Username address already exists!", -2);
                        return next(error);
                    }
                    else {
                        user.username = username;
                    }
                }
                yield user.save();
                return res.status(httpStatusCode_util_1.default.OK).json({
                    success: true,
                    code: 1,
                });
            }
            catch (error) {
                console.log(error);
                const err = new error_exception_1.default(httpStatusCode_util_1.default.NOT_FOUND, "Internal Error Occured", -5);
                return next(err);
            }
        });
    }
    static getUserFollowers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const user = yield user_model_1.default.findById(userId)
                    .select("followers")
                    .populate("followers");
                if (user == null) {
                    const error = new error_exception_1.default(httpStatusCode_util_1.default.NOT_FOUND, "User not found", -2);
                    return next(error);
                }
                let followers = [];
                user.followers.forEach((element) => {
                    followers.push({
                        follower: element,
                        isThisMe: element.id === req.userId,
                    });
                });
                res.status(httpStatusCode_util_1.default.OK).json({
                    success: true,
                    followers: followers,
                    totalFollowers: user.followers.length,
                    code: 1,
                });
            }
            catch (error) {
                console.log(error);
                const err = new error_exception_1.default(httpStatusCode_util_1.default.NOT_FOUND, "Internal Error Occured", -5);
                return next(err);
            }
        });
    }
    static getUserFollowings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const user = yield user_model_1.default.findById(userId)
                    .select("followings")
                    .populate("followings");
                if (user == null) {
                    const error = new error_exception_1.default(httpStatusCode_util_1.default.NOT_FOUND, "User not found", -2);
                    return next(error);
                }
                let followings = [];
                user.followings.forEach((element) => {
                    followings.push({
                        follower: element,
                        isThisMe: element.id === req.userId,
                    });
                });
                res.status(httpStatusCode_util_1.default.OK).json({
                    success: true,
                    followings: followings,
                    totalFollowings: user.followings.length,
                    code: 1,
                });
            }
            catch (error) {
                console.log(error);
                const err = new error_exception_1.default(httpStatusCode_util_1.default.NOT_FOUND, "Internal Error Occured", -5);
                return next(err);
            }
        });
    }
}
exports.default = UserController;
