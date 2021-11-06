"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const express_1 = __importDefault(require("express"));
const post_controller_1 = __importDefault(require("../controllers/post.controller"));
const express_validator_1 = require("express-validator");
const is_auth_middleware_1 = __importDefault(require("../middleware/is_auth.middleware"));
const postRouter = (0, express_1.default)();
exports.postRouter = postRouter;
/// Create Post
postRouter.post("/createPost", is_auth_middleware_1.default, (0, express_validator_1.body)("title")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Please enter a title")
    .isLength({ min: 5 })
    .withMessage("Title cannot be less than 5 characters"), (0, express_validator_1.body)("description")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Please enter a description")
    .isLength({ min: 5 })
    .withMessage("Content cannot be less than 5 characters"), post_controller_1.default.createPost);
// View Particular Post
postRouter.get("/view/:postId", is_auth_middleware_1.default, post_controller_1.default.viewPost);
// Get All Post
postRouter.get("/viewall", is_auth_middleware_1.default, post_controller_1.default.getAllPost);
// Update Post
postRouter.post("/update/:postId", (0, express_validator_1.body)("title")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Please enter a title")
    .isLength({ min: 5 })
    .withMessage("Title cannot be less than 5 characters"), (0, express_validator_1.body)("description")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Please enter a description")
    .isLength({ min: 5 })
    .withMessage("Content cannot be less than 5 characters"), is_auth_middleware_1.default, post_controller_1.default.updatePost);
postRouter.get("/delete/:postId", is_auth_middleware_1.default, post_controller_1.default.deletePost);
postRouter.get("/postBasedOnTag/:tag", is_auth_middleware_1.default, post_controller_1.default.getPostBasedOnTag);
postRouter.get("/likeDislikeThisPost/:postId", is_auth_middleware_1.default, post_controller_1.default.userLikeDislikePost);
