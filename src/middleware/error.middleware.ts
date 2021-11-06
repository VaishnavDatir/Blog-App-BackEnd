import { NextFunction, Request, Response } from "express";

import HttpException from "../exceptions/error.exception";
import HttpStatusCode from "../utils/httpStatusCode.util";

function errorMiddleware(
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const success: boolean = false;
  const status: number = error.status || HttpStatusCode.INTERNAL_SERVER_ERROR;
  const message: string = error.message || "Something went wrong";
  const code: number = (error.code as number) || -1;
  const data: any = error.data;
  response.status(status).send({
    success,
    message,
    data,
    code,
  });
}

export default errorMiddleware;

/* 
   1 : Success

  -1 : Main Program Error
  -2 : Validation Error
  -3 : In Program Error
  -4 : function Try catch Error
  -5 : User not Authenticated
  -6 : Post not Found
*/
