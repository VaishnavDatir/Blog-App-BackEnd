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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_exception_1 = __importDefault(require("../exceptions/error.exception"));
const httpStatusCode_util_1 = __importDefault(require("../utils/httpStatusCode.util"));
const isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.get("Authorization");
        if (!authHeader) {
            const error = new error_exception_1.default(httpStatusCode_util_1.default.UNAUTHORIZED, "User not authenticated!", -5);
            return next(error);
        }
        const token = authHeader.split(" ")[1];
        yield jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY, (jwterr, verifiedJwt) => {
            if (jwterr) {
                const err = new error_exception_1.default(httpStatusCode_util_1.default.UNAUTHORIZED, (jwterr === null || jwterr === void 0 ? void 0 : jwterr.message) || "User not Authenticated", -4);
                return next(err);
            }
            else {
                req.userId = verifiedJwt === null || verifiedJwt === void 0 ? void 0 : verifiedJwt.userId;
                next();
            }
        });
    }
    catch (error) {
        console.log(error);
        const err = new error_exception_1.default(httpStatusCode_util_1.default.NOT_FOUND, "Internal Error Occured", -4);
        return next(err);
    }
});
exports.default = isAuth;
