import { NextFunction, Request, Response } from "express";

import User from "../models/user.model";
import Post from "../models/post.model";

import HttpException from "../exceptions/error.exception";
import HttpStatusCode from "../utils/httpStatusCode.util";

import IUser from "../interfaces/user.interface";

class UserController {
  static async viewUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId: string = req.params.userId as string;

      const user: IUser = await User.findById(userId)
        .select("followers followings")
        .populate("posts");

      if (!user) {
        const error: HttpException = new HttpException(
          HttpStatusCode.NOT_FOUND,
          "User not found",
          -2
        );
        return next(error);
      }

      const isThisMe: boolean = userId === req.userId;

      return res.status(HttpStatusCode.OK).json({
        success: true,
        user,
        isThisMe,
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

  //delete User
  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user: IUser = await User.findByIdAndDelete(
        req.userId
      ).lean<IUser>();

      if (!user) {
        const error: HttpException = new HttpException(
          HttpStatusCode.NOT_FOUND,
          "User not found",
          -2
        );
        return next(error);
      }
      await Post.deleteMany({
        author: user?.id,
      });

      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: "The user has been deleted",
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

  static async setUserFollowOther(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId: string = req.params.userId as string;

      const user: IUser | null = await User.findById(userId).select(
        "followers followings"
      );

      if (user == null) {
        const error: HttpException = new HttpException(
          HttpStatusCode.NOT_FOUND,
          "User not found",
          -2
        );
        return next(error);
      }

      const me: IUser = (await User.findById(req.userId).select(
        "followers followings"
      )) as IUser;

      if (user.followers.includes(me.id)) {
        const myIndex: number = me?.followings.indexOf(me) as number;
        me?.followings.splice(myIndex);

        const userIndex: number = user?.followers.indexOf(me) as number;
        user?.followers.splice(userIndex);
      } else {
        user?.followers.push(me);
        me?.followings.push(user);
      }

      await user.save();
      await me.save();

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

  static async updateUserProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user: IUser | null = await User.findById(req.userId);

      if (user == null) {
        const error: HttpException = new HttpException(
          HttpStatusCode.NOT_FOUND,
          "User not found",
          -2
        );
        return next(error);
      }

      let { name, username, bio } = req.body;

      user.name = name;
      user.bio = bio;

      if (user.username != username) {
        const usedUserName: boolean = await User.exists({ username: username });
        if (usedUserName) {
          const error: HttpException = new HttpException(
            HttpStatusCode.NOT_FOUND,
            "Username address already exists!",
            -2
          );
          return next(error);
        } else {
          user.username = username;
        }
      }

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

  static async getUserFollowers(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId: string = req.params.userId as string;

      const user: IUser | null = await User.findById(userId)
        .select("followers")
        .populate("followers");

      if (user == null) {
        const error: HttpException = new HttpException(
          HttpStatusCode.NOT_FOUND,
          "User not found",
          -2
        );
        return next(error);
      }
      let followers: TUser[] = [];

      user.followers.forEach((element) => {
        followers.push({
          follower: element,
          isThisMe: element.id === req.userId,
        });
      });

      res.status(HttpStatusCode.OK).json({
        success: true,
        followers: followers,
        totalFollowers: user.followers.length,
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

  static async getUserFollowings(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId: string = req.params.userId as string;

      const user: IUser | null = await User.findById(userId)
        .select("followings")
        .populate("followings");

      if (user == null) {
        const error: HttpException = new HttpException(
          HttpStatusCode.NOT_FOUND,
          "User not found",
          -2
        );
        return next(error);
      }
      let followings: TUser[] = [];

      user.followings.forEach((element) => {
        followings.push({
          follower: element,
          isThisMe: element.id === req.userId,
        });
      });

      res.status(HttpStatusCode.OK).json({
        success: true,
        followings: followings,
        totalFollowings: user.followings.length,
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

type TUser = {
  follower: any;
  isThisMe: boolean;
};

export default UserController;
