import Router from "express";
import PostController from "../controllers/post.controller";

import { body } from "express-validator";
import isAuth from "../middleware/is_auth.middleware";

const postRouter = Router();

/// Create Post
postRouter.post(
  "/createPost",
  isAuth,
  body("title")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Please enter a title")
    .isLength({ min: 5 })
    .withMessage("Title cannot be less than 5 characters"),

  body("description")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Please enter a description")
    .isLength({ min: 5 })
    .withMessage("Content cannot be less than 5 characters"),
  PostController.createPost
);

// View Particular Post
postRouter.get("/view/:postId", isAuth, PostController.viewPost);

// Get All Post
postRouter.get("/viewall", isAuth, PostController.getAllPost);

// Update Post
postRouter.post(
  "/update/:postId",
  body("title")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Please enter a title")
    .isLength({ min: 5 })
    .withMessage("Title cannot be less than 5 characters"),

  body("description")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Please enter a description")
    .isLength({ min: 5 })
    .withMessage("Content cannot be less than 5 characters"),
  isAuth,
  PostController.updatePost
);

postRouter.get("/delete/:postId", isAuth, PostController.deletePost);

postRouter.get(
  "/postBasedOnTag/:tag",
  isAuth,
  PostController.getPostBasedOnTag
);

postRouter.get(
  "/likeDislikeThisPost/:postId",
  isAuth,
  PostController.userLikeDislikePost
);

export { postRouter };
