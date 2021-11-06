import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model";

import HttpException from "../exceptions/error.exception";
import HttpStatusCode from "../utils/httpStatusCode.util";

import IUser from "../interfaces/user.interface";

import mongoose from "mongoose";
class AuthenticationController {
  ///FOR User Sign Up
  static async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error: HttpException = new HttpException(
          HttpStatusCode.NOT_ACCEPTABLE,
          "Cannot Sign up",
          -2,
          errors.array()
        );
        return next(error);
      }
      let { name, username, email, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        name: name,
        username: username,
        email: email,
        password: hashedPassword,
      });

      const result: IUser = await user.save();

      if (result !== null) {
        return res.status(HttpStatusCode.CREATED).json({
          success: true,
          message: "User created",
          userId: result._id,
          code: 1,
        });
      } else {
        const gotError: HttpException = new HttpException(
          HttpStatusCode.EXPECTATION_FAILED,
          "There was an error while creating user",
          -3
        );
        return next(gotError);
      }
    } catch (error) {
      console.log(error);
      const err: HttpException = new HttpException(
        HttpStatusCode.NOT_FOUND,
        "Internal Error Occured",
        -4
      );
      return next(err);
    }
  }

  static async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error: HttpException = new HttpException(
          HttpStatusCode.NOT_ACCEPTABLE,
          "Cannot Sign in",
          -2,
          errors.array()
        );
        return next(error);
      }

      const id: string = req.body.id;
      const password = req.body.password;

      let user;

      if (id.includes("@")) {
        user = await User.findOne({ email: id }).select("+password");
      } else {
        user = await User.findOne({ username: id }).select("+password");
      }

      if (!user) {
        const error: HttpException = new HttpException(
          HttpStatusCode.NOT_FOUND,
          "User not found",
          -2
        );
        return next(error);
      }

      const isEqual: boolean = await bcrypt.compare(password, user.password);

      if (!isEqual) {
        const error: HttpException = new HttpException(
          HttpStatusCode.UNAUTHORIZED,
          "Invalid Password",
          -5
        );
        return next(error);
      }

      const token = await jwt.sign(
        {
          email: user.username,
          userId: user._id,
        },
        process.env.JWT_SECRET_KEY as string
        // { expiresIn: "15s" }
      );

      return res.status(HttpStatusCode.ACCEPTED).json({
        success: true,
        token: token,
        userid: user._id,
        code: 1,
      });
    } catch (error) {
      console.log(error);
      const err: HttpException = new HttpException(
        HttpStatusCode.NOT_FOUND,
        "Internal Error Occured",
        -5
      );
      return next(err);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const user: IUser | null = await User.findById(req.userId).select(
        "password"
      );

      if (user == null) {
        const error: HttpException = new HttpException(
          HttpStatusCode.NOT_FOUND,
          "User not found",
          -2
        );
        return next(error);
      }

      let { password, newPassword } = req.body;

      const isEqual: boolean = await bcrypt.compare(password, user.password);

      if (!isEqual) {
        const error: HttpException = new HttpException(
          HttpStatusCode.UNAUTHORIZED,
          "Invalid Password",
          -5
        );
        return next(error);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      user.password = hashedPassword;

      await user.save();

      return res.status(HttpStatusCode.OK).json({
        success: true,
        code: 1,
      });
    } catch (error) {
      console.log(error);
      const err: HttpException = new HttpException(
        HttpStatusCode.NOT_FOUND,
        "Internal Error Occured",
        -5
      );
      return next(err);
    }
  }
}

export default AuthenticationController;
