import express from "express";
import jwt from "jsonwebtoken";

import HttpException from "../exceptions/error.exception";
import HttpStatusCode from "../utils/httpStatusCode.util";

const isAuth = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const authHeader: string = req.get("Authorization") as string;

    if (!authHeader) {
      const error: HttpException = new HttpException(
        HttpStatusCode.UNAUTHORIZED,
        "User not authenticated!",
        -5
      );
      return next(error);
    }

    const token = authHeader.split(" ")[1];

    await jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string,
      (jwterr, verifiedJwt) => {
        if (jwterr) {
          const err: HttpException = new HttpException(
            HttpStatusCode.UNAUTHORIZED,
            jwterr?.message || "User not Authenticated",
            -4
          );
          return next(err);
        } else {
          req.userId = verifiedJwt?.userId;
          next();
        }
      }
    );
  } catch (error) {
    console.log(error);
    const err: HttpException = new HttpException(
      HttpStatusCode.NOT_FOUND,
      "Internal Error Occured",
      -4
    );
    return next(err);
  }
};

export default isAuth;
