import mongoose, { Schema, model, models } from "mongoose";

const BookmarkSchema = new Schema(
  {
    user: {
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

BookmarkSchema.index(
  { user: 1, post: 1 },
  { unique: true }
);

const Bookmark =
  models.Bookmark || model("Bookmark", BookmarkSchema);

export default Bookmark;