import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

import User from "../models/user.model";
import Post from "../models/post.model";

import HttpException from "../exceptions/error.exception";
import HttpStatusCode from "../utils/httpStatusCode.util";

import IUser from "../interfaces/user.interface";
import IPost from "../interfaces/post.interface";

class PostController {
  // Create Post
  static async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error: HttpException = new HttpException(
          HttpStatusCode.NOT_ACCEPTABLE,
          "Cannot create post",
          -2,
          errors.array()
        );
        return next(error);
      }

      let { title, description, tags } = req.body;

      const author = req.userId;

      const post: IPost = new Post({
        title: title,
        description: description,
        tags: tags,
        author: author,
      });

      const result: IPost = await post.save();

      if (result == null) {
        const gotError: HttpException = new HttpException(
          HttpStatusCode.EXPECTATION_FAILED,
          "There was an error while creating this post",
          -3
        );
        return next(gotError);
      }

      const user = await User.findById(req.userId).select("posts");
      user!!.posts.push(result.id);
      await user?.save();

      return res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: "Post created",
        post: result,
        code: 1,
      });
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

  // View post
  static async viewPost(req: Request, res: Response, next: NextFunction) {
    try {
      const postId: string = req.params.postId as string;

      const post = await Post.findById(postId).populate("author", "id name");

      if (!post) {
        const err: HttpException = new HttpException(
          HttpStatusCode.NOT_FOUND,
          "Post Not Found!",
          -6
        );
        return next(err);
      }

      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Post Fetched",
        post: post,
        code: 1,
      });
    } catch (error) {
      const err: HttpException = new HttpException(
        HttpStatusCode.NOT_FOUND,
        "Internal Error Occured",
        -4
      );
      return next(err);
    }
  }

  // Get All Post
  static async getAllPost(req: Request, res: Response, next: NextFunction) {
    try {
      const currentPage: number =
        +(req.query.page as unknown as number) || +(1 as number);
      const perPage: number = 3;

      const user: IUser | null = await User.findById(req.userId).select(
        "followings"
      );

      if (user == null) {
        const gotError: HttpException = new HttpException(
          HttpStatusCode.EXPECTATION_FAILED,
          "There was an error while creating this post",
          -3
        );
        return next(gotError);
      }

      console.log(user);

      const posts = await Post.find({
        author: { $in: user.followings },
      })
        .populate("author", "id name")
        .skip((currentPage - 1) * perPage)
        .limit(perPage);

      const totalItems: number = posts.length;
      const totalPages: number = Math.ceil(totalItems / perPage);

      return res.status(HttpStatusCode.OK).json({
        success: true,
        posts: posts,
        totalItems: totalItems,
        totalPages: totalPages,
        perPage: perPage,
        currentPage: currentPage,
      });
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

  // Update post
  static async updatePost(req: Request, res: Response, next: NextFunction) {
    try {
      const postId: string = req.params.postId as string;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error: HttpException = new HttpException(
          HttpStatusCode.NOT_ACCEPTABLE,
          "Cannot update post",
          -2,
          errors.array()
        );
        return next(error);
      }

      const post = await Post.findById(postId);

      if (!post) {
        const err: HttpException = new HttpException(
          HttpStatusCode.NOT_FOUND,
          "Post Not Found!",
          -6
        );
        return next(err);
      }

      const isAuthor: boolean = req.userId == post?.author._id;

      if (!isAuthor) {
        const gotError: HttpException = new HttpException(
          HttpStatusCode.UNAUTHORIZED,
          "The user cannot edit this post",
          -2
        );
        return next(gotError);
      }

      if (req.body.title) post.title = req.body.title;
      if (req.body.description) post.description = req.body.description;
      if (req.body.tags) post.tags = req.body.tags;

      const result = await post.save();

      if (result == null) {
        const gotError: HttpException = new HttpException(
          HttpStatusCode.EXPECTATION_FAILED,
          "There was an error while creating this post",
          -3
        );
        return next(gotError);
      }

      res.status(200).json({
        success: true,
        message: "Post updated!",
        post: result,
        code: 1,
      });
    } catch (error) {
      const err: HttpException = new HttpException(
        HttpStatusCode.NOT_FOUND,
        "Internal Error Occured",
        -4
      );
      return next(err);
    }
  }

  //Delete Post
  static async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      const postId: string = req.params.postId as string;

      const post = await Post.findById(postId);

      if (!post) {
        const err: HttpException = new HttpException(
          HttpStatusCode.NOT_FOUND,
          "Post Not Found!",
          -6
        );
        return next(err);
      }

      const isAuthor: boolean = req.userId == post?.author._id;

      if (!isAuthor) {
        const gotError: HttpException = new HttpException(
          HttpStatusCode.UNAUTHORIZED,
          "The user cannot edit this post",
          -2
        );
        return next(gotError);
      }

      const result = await post.delete();

      if (result == null) {
        const gotError: HttpException = new HttpException(
          HttpStatusCode.EXPECTATION_FAILED,
          "There was an error while creating this post",
          -3
        );
        return next(gotError);
      }

      const user = await User.findById(req.userId);

      if (user == null) {
        const gotError: HttpException = new HttpException(
          HttpStatusCode.EXPECTATION_FAILED,
          "There was an error while creating this post",
          -3
        );
        return next(gotError);
      }
      const postIndex: number = user?.posts.indexOf(post) as number;

      user.posts.splice(postIndex);

      const userResult = await user.save();

      if (userResult == null) {
        const gotError: HttpException = new HttpException(
          HttpStatusCode.EXPECTATION_FAILED,
          "There was an error while creating this post",
          -3
        );
        return next(gotError);
      }
      res.status(200).json({
        success: true,
        message: "Post deleted!",
        code: 1,
      });
    } catch (error) {
      const err: HttpException = new HttpException(
        HttpStatusCode.NOT_FOUND,
        "Internal Error Occured",
        -4
      );
      return next(err);
    }
  }

  //Get Post Baised on tags
  static async getPostBasedOnTag(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const tag: string = req.params.tag.toLowerCase() as string;
      if (tag.startsWith("#")) {
        tag.replace("#", "");
      }

      const postDoc = await Post.find({
        tags: { $all: [new RegExp("^" + tag + "$", "i")] },
      }).populate("author", "id name");

      res.status(HttpStatusCode.OK).json({
        success: true,
        data: postDoc,
        code: 1,
      });
    } catch (error) {
      const err: HttpException = new HttpException(
        HttpStatusCode.NOT_FOUND,
        "Internal Error Occured",
        -4
      );
      return next(err);
    }
  }

  static async userLikeDislikePost(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const postId: string = req.params.postId as string;

      const post = await Post.findById(postId);

      if (!post) {
        const err: HttpException = new HttpException(
          HttpStatusCode.NOT_FOUND,
          "Post Not Found!",
          -6
        );
        return next(err);
      }

      const user: IUser = (await User.findById(req.userId)) as IUser;

      if (post.likes.includes(user.id)) {
        const userIndex: number = post.likes.indexOf(user) as number;
        post.likes.splice(userIndex);
      } else {
        post?.likes.push(user);
      }

      const result = await post.save();

      res.status(HttpStatusCode.OK).json({
        success: true,

        code: 1,
      });
    } catch (error) {
      const err: HttpException = new HttpException(
        HttpStatusCode.NOT_FOUND,
        "Internal Error Occured",
        -4
      );
      return next(err);
    }
  }
}

export default PostController;
