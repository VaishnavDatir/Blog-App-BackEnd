"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatusCode_util_1 = __importDefault(require("../utils/httpStatusCode.util"));
function errorMiddleware(error, request, response, next) {
    const success = false;
    const status = error.status || httpStatusCode_util_1.default.INTERNAL_SERVER_ERROR;
    const message = error.message || "Something went wrong";
    const code = error.code || -1;
    const data = error.data;
    response.status(status).send({
        success,
        message,
        data,
        code,
    });
}
exports.default = errorMiddleware;
/*
   1 : Success

  -1 : Main Program Error
  -2 : Validation Error
  -3 : In Program Error
  -4 : function Try catch Error
  -5 : User not Authenticated
  -6 : Post not Found
*/
