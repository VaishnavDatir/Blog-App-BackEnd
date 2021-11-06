import mongoose, { Schema } from "mongoose";
import IUser from "../interfaces/user.interface";

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, select: false, unique: true },
    password: { type: String, required: true, select: false },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: false,
        select: false,
      },
    ],
    bio: { type: String, required: false, select: false },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
        select: false,
      },
    ],
    followings: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
        select: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", UserSchema);
