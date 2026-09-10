import mongoose, { Schema, model, models } from "mongoose";

const CommentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

CommentSchema.index({ post: 1, createdAt: -1 });

const Comment =
  models.Comment || model("Comment", CommentSchema);

export default Comment;