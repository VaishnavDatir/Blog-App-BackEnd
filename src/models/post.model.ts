import mongoose, { Schema } from "mongoose";
import IPost from "../interfaces/post.interface";

const PostSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    /* commets: [
      {
        type: Schema.Types.Mixed,
      },
    ], */
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPost>("Post", PostSchema);
