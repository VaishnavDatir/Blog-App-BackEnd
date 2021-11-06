"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRouter = void 0;
const express_1 = __importDefault(require("express"));
const error_exception_1 = __importDefault(require("../exceptions/error.exception"));
const testRouter = (0, express_1.default)();
exports.testRouter = testRouter;
testRouter.get("/servercheck", (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Server is working",
    });
});
testRouter.get("/checkMainError", (req, res, next) => {
    const error = new error_exception_1.default(404, "This is error");
    next(error);
});
