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
const express_validator_1 = require("express-validator");
const user_model_1 = __importDefault(require("../models/user.model"));
const post_model_1 = __importDefault(require("../models/post.model"));
const error_exception_1 = __importDefault(require("../exceptions/error.exception"));
const httpStatusCode_util_1 = __importDefault(require("../utils/httpStatusCode.util"));
class PostController {
    // Create Post
    static createPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    const error = new error_exception_1.default(httpStatusCode_util_1.default.NOT_ACCEPTABLE, "Cannot create post", -2, errors.array());
                    return next(error);
                }
                let { title, description, tags } = req.body;
                const author = req.userId;
                const post = new post_model_1.default({
                    title: title,
                    description: description,
                    tags: tags,
                    author: author,
                });
                const result = yield post.save();
                if (result == null) {
                    const gotError = new error_exception_1.default(httpStatusCode_util_1.default.EXPECTATION_FAILED, "There was an error while creating this post", -3);
                    return next(gotError);
                }
                const user = yield user_model_1.default.findById(req.userId).select("posts");
                user.posts.push(result.id);
                yield (user === null || user === void 0 ? void 0 : user.save());
                return res.status(httpStatusCode_util_1.default.CREATED).json({
                    success: true,
                    message: "Post created",
                    post: result,
                    code: 1,
                });
            }
            catch (error) {
                console.log(error);
                const err = new error_exception_1.default(httpStatusCode_util_1.default.NOT_FOUND, "Internal Error Occured", -4);
                return next(err);
            }
        });
    }
    // View post
    static viewPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = req.params.postId;
                const post = yield post_model_1.default.findById(postId).populate("author", "id name");
                if (!post) {
                    const err = new error_exception_1.default(httpStatusCode_util_1.default.NOT_FOUND, "Post Not Found!", -6);
                    return next(err);
                }
                return res.status(httpStatusCode_util_1.default.OK).json({
                    success: true,
                    message: "Post Fetched",
                    post: post,
                    code: 1,
                });
            }
            catch (error) {
                const err = new error_exception_1.default(httpStatusCode_util_1.default.NOT_FOUND, "Internal Error Occured", -4);
                return next(err);
            }
        });
    }
    // Get All Post
    static getAllPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentPage = +req.query.page || +1;
                const perPage = 3;
                const user = yield user_model_1.default.findById(req.userId).select("followings");
                if (user == null) {
                    const gotError = new error_exception_1.default(httpStatusCode_util_1.default.EXPECTATION_FAILED, "There was an error while creating this post", -3);
                    return next(gotError);
                }
                console.log(user);
                const posts = yield post_model_1.default.find({
                    author: { $in: user.followings },
                })
                    .populate("author", "id name")
                    .skip((currentPage - 1) * perPage)
                    .limit(perPage);
                const totalItems = posts.length;
                const totalPages = Math.ceil(totalItems / perPage);
                return res.status(httpStatusCode_util_1.default.OK).json({
                    success: true,
                    posts: posts,
                    totalItems: totalItems,
                    totalPages: totalPages,
                    perPage: perPage,
                    currentPage: currentPage,
                });
            }
            catch (error) {
                console.log(error);
                const err = new error_exception_1.default(httpStatusCode_util_1.default.NOT_FOUND, "Internal Error Occured", -4);
                return next(err);
            }
        });
    }
    // Update post
    static updatePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = req.params.postId;
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    const error = new error_exception_1.default(httpStatusCode_util_1.default.NOT_ACCEPTABLE, "Cannot update post", -2, errors.array());
                    return next(error);
                }
                const post = yield post_model_1.default.findById(postId);
                if (!post) {
                    const err = new error_exception_1.default(httpStatusCode_util_1.default.NOT_FOUND, "Post Not Found!", -6);
                    return next(err);
                }
                const isAuthor = req.userId == (post === null || post === void 0 ? void 0 : post.author._id);
                if (!isAuthor) {
                    const gotError = new error_exception_1.default(httpStatusCode_util_1.default.UNAUTHORIZED, "The user cannot edit this post", -2);
                    return next(gotError);
                }
                if (req.body.title)
                    post.title = req.body.title;
                if (req.body.description)
                    post.description = req.body.description;
                if (req.body.tags)
                    post.tags = req.body.tags;
                const result = yield post.save();
                if (result == null) {
                    const gotError = new error_exception_1.default(httpStatusCode_util_1.default.EXPECTATION_FAILED, "There was an error while creating this post", -3);
                    return next(gotError);
                }
                res.status(200).json({
                    success: true,
                    message: "Post updated!",
                    post: result,
                    code: 1,
                });
            }
            catch (error) {
                const err = new error_exception_1.default(httpStatusCode_util_1.default.NOT_FOUND, "Internal Error Occured", -4);
                return next(err);
            }
        });
    }
    //Delete Post
    static deletePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = req.params.postId;
                const post = yield post_model_1.default.findById(postId);
                if (!post) {
                    const err = new error_exception_1.default(httpStatusCode_util_1.default.NOT_FOUND, "Post Not Found!", -6);
                    return next(err);
                }
                const isAuthor = req.userId == (post === null || post === void 0 ? void 0 : post.author._id);
                if (!isAuthor) {
                    const gotError = new error_exception_1.default(httpStatusCode_util_1.default.UNAUTHORIZED, "The user cannot edit this post", -2);
                    return next(gotError);
                }
                const result = yield post.delete();
                if (result == null) {
                    const gotError = new error_exception_1.default(httpStatusCode_util_1.default.EXPECTATION_FAILED, "There was an error while creating this post", -3);
                    return next(gotError);
                }
                const user = yield user_model_1.default.findById(req.userId);
                if (user == null) {
                    const gotError = new error_exception_1.default(httpStatusCode_util_1.default.EXPECTATION_FAILED, "There was an error while creating this post", -3);
                    return next(gotError);
                }
                const postIndex = user === null || user === void 0 ? void 0 : user.posts.indexOf(post);
                user.posts.splice(postIndex);
                const userResult = yield user.save();
                if (userResult == null) {
                    const gotError = new error_exception_1.default(httpStatusCode_util_1.default.EXPECTATION_FAILED, "There was an error while creating this post", -3);
                    return next(gotError);
                }
                res.status(200).json({
                    success: true,
                    message: "Post deleted!",
                    code: 1,
                });
            }
            catch (error) {
                const err = new error_exception_1.default(httpStatusCode_util_1.default.NOT_FOUND, "Internal Error Occured", -4);
                return next(err);
            }
        });
    }
    //Get Post Baised on tags
    static getPostBasedOnTag(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tag = req.params.tag.toLowerCase();
                if (tag.startsWith("#")) {
                    tag.replace("#", "");
                }
                const postDoc = yield post_model_1.default.find({
                    tags: { $all: [new RegExp("^" + tag + "$", "i")] },
                }).populate("author", "id name");
                res.status(httpStatusCode_util_1.default.OK).json({
                    success: true,
                    data: postDoc,
                    code: 1,
                });
            }
            catch (error) {
                const err = new error_exception_1.default(httpStatusCode_util_1.default.NOT_FOUND, "Internal Error Occured", -4);
                return next(err);
            }
        });
    }
    static userLikeDislikePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = req.params.postId;
                const post = yield post_model_1.default.findById(postId);
                if (!post) {
                    const err = new error_exception_1.default(httpStatusCode_util_1.default.NOT_FOUND, "Post Not Found!", -6);
                    return next(err);
                }
                const user = (yield user_model_1.default.findById(req.userId));
                if (post.likes.includes(user.id)) {
                    const userIndex = post.likes.indexOf(user);
                    post.likes.splice(userIndex);
                }
                else {
                    post === null || post === void 0 ? void 0 : post.likes.push(user);
                }
                const result = yield post.save();
                res.status(httpStatusCode_util_1.default.OK).json({
                    success: true,
                    code: 1,
                });
            }
            catch (error) {
                const err = new error_exception_1.default(httpStatusCode_util_1.default.NOT_FOUND, "Internal Error Occured", -4);
                return next(err);
            }
        });
    }
}
exports.default = PostController;
