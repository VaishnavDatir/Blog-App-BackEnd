"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const authentication_controller_1 = __importDefault(require("../controllers/authentication.controller"));
const user_model_1 = __importDefault(require("../models/user.model"));
const express_validator_1 = require("express-validator");
const is_auth_middleware_1 = __importDefault(require("../middleware/is_auth.middleware"));
const authRouter = (0, express_1.default)();
exports.authRouter = authRouter;
/// Sign Up
authRouter.post("/signup", (0, express_validator_1.body)("name").trim().not().isEmpty().withMessage("Please enter your name"), (0, express_validator_1.body)("email")
    .trim()
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom((value, { req }) => {
    return user_model_1.default.exists({ email: value }).then((userDoc) => {
        if (userDoc) {
            return Promise.reject("E-Mail address already exists!");
        }
    });
})
    .normalizeEmail({ gmail_remove_dots: false }), (0, express_validator_1.body)("username")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Please enter a valid username")
    .not()
    .contains(" ")
    .withMessage("Username should not contain space")
    .custom((value, { req }) => {
    return user_model_1.default.exists({ username: value }).then((userDoc) => {
        if (userDoc) {
            return Promise.reject("Username address already exists!");
        }
    });
}), (0, express_validator_1.body)("password")
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 5 })
    .withMessage("Please enter a password of atleast 5 characters"), authentication_controller_1.default.signUp);
/// Sign In
authRouter.post("/signin", (0, express_validator_1.body)("id")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Please enter a valid email id or username"), (0, express_validator_1.body)("password")
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 5 })
    .withMessage("Please enter a password of atleast 5 characters"), authentication_controller_1.default.signIn);
authRouter.post("/changePassword", is_auth_middleware_1.default, authentication_controller_1.default.changePassword);
