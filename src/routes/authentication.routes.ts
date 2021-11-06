import Router from "express";
import AuthenticationController from "../controllers/authentication.controller";

import User from "../models/user.model";
import { body } from "express-validator";
import isAuth from "../middleware/is_auth.middleware";

const authRouter = Router();

/// Sign Up
authRouter.post(
  "/signup",
  body("name").trim().not().isEmpty().withMessage("Please enter your name"),
  body("email")
    .trim()
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom((value, { req }) => {
      return User.exists({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject("E-Mail address already exists!");
        }
      });
    })
    .normalizeEmail({ gmail_remove_dots: false }),
  body("username")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Please enter a valid username")
    .not()
    .contains(" ")
    .withMessage("Username should not contain space")
    .custom((value, { req }) => {
      return User.exists({ username: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject("Username address already exists!");
        }
      });
    }),
  body("password")
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 5 })
    .withMessage("Please enter a password of atleast 5 characters"),

  AuthenticationController.signUp
);

/// Sign In
authRouter.post(
  "/signin",
  body("id")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Please enter a valid email id or username"),
  body("password")
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 5 })
    .withMessage("Please enter a password of atleast 5 characters"),

  AuthenticationController.signIn
);

authRouter.post(
  "/changePassword",
  isAuth,
  AuthenticationController.changePassword
);

export { authRouter };
