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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../models/user.model"));
const error_exception_1 = __importDefault(require("../exceptions/error.exception"));
const httpStatusCode_util_1 = __importDefault(require("../utils/httpStatusCode.util"));
class AuthenticationController {
    ///FOR User Sign Up
    static signUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    const error = new error_exception_1.default(httpStatusCode_util_1.default.NOT_ACCEPTABLE, "Cannot Sign up", -2, errors.array());
                    return next(error);
                }
                let { name, username, email, password } = req.body;
                const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
                const user = new user_model_1.default({
                    name: name,
                    username: username,
                    email: email,
                    password: hashedPassword,
                });
                const result = yield user.save();
                if (result !== null) {
                    return res.status(httpStatusCode_util_1.default.CREATED).json({
                        success: true,
                        message: "User created",
                        userId: result._id,
                        code: 1,
                    });
                }
                else {
                    const gotError = new error_exception_1.default(httpStatusCode_util_1.default.EXPECTATION_FAILED, "There was an error while creating user", -3);
                    return next(gotError);
                }
            }
            catch (error) {
                console.log(error);
                const err = new error_exception_1.default(httpStatusCode_util_1.default.NOT_FOUND, "Internal Error Occured", -4);
                return next(err);
            }
        });
    }
    static signIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    const error = new error_exception_1.default(httpStatusCode_util_1.default.NOT_ACCEPTABLE, "Cannot Sign in", -2, errors.array());
                    return next(error);
                }
                const id = req.body.id;
                const password = req.body.password;
                let user;
                if (id.includes("@")) {
                    user = yield user_model_1.default.findOne({ email: id }).select("+password");
                }
                else {
                    user = yield user_model_1.default.findOne({ username: id }).select("+password");
                }
                if (!user) {
                    const error = new error_exception_1.default(httpStatusCode_util_1.default.NOT_FOUND, "User not found", -2);
                    return next(error);
                }
                const isEqual = yield bcryptjs_1.default.compare(password, user.password);
                if (!isEqual) {
                    const error = new error_exception_1.default(httpStatusCode_util_1.default.UNAUTHORIZED, "Invalid Password", -5);
                    return next(error);
                }
                const token = yield jsonwebtoken_1.default.sign({
                    email: user.username,
                    userId: user._id,
                }, process.env.JWT_SECRET_KEY
                // { expiresIn: "15s" }
                );
                return res.status(httpStatusCode_util_1.default.ACCEPTED).json({
                    success: true,
                    token: token,
                    userid: user._id,
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
    static changePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findById(req.userId).select("password");
                if (user == null) {
                    const error = new error_exception_1.default(httpStatusCode_util_1.default.NOT_FOUND, "User not found", -2);
                    return next(error);
                }
                let { password, newPassword } = req.body;
                const isEqual = yield bcryptjs_1.default.compare(password, user.password);
                if (!isEqual) {
                    const error = new error_exception_1.default(httpStatusCode_util_1.default.UNAUTHORIZED, "Invalid Password", -5);
                    return next(error);
                }
                const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 12);
                user.password = hashedPassword;
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
}
exports.default = AuthenticationController;
