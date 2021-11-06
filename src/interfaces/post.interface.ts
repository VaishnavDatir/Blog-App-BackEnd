import { Document } from "mongoose";
import IUser from "./user.interface";

export default interface IPost extends Document {
  title: string;
  description: string;
  tags: string[];
  author: IUser;
  likes: IUser[];
  /*  comments: {
    user: IUser;
    comment: string;
  }[]; */
  createdAt: Date;
  updatedAt: Date;
}
