"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpException extends Error {
    constructor(status, message, code, data) {
        super(message);
        this.status = status;
        this.message = message;
        this.code = code;
        this.data = data;
    }
}
exports.default = HttpException;
