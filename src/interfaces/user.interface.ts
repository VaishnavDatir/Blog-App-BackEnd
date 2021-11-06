import { Document } from "mongoose";
import IPost from "./post.interface";

export default interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  posts: IPost[];
  bio: string;
  followers: IUser[];
  followings: IUser[];
  createdAt: Date;
  updatedAt: Date;
}
