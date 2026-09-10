import mongoose, { Schema, model, models } from "mongoose";

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    content: {
      type: String,
      required: true,
    },

    excerpt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },

    topics: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    published: {
      type: Boolean,
      default: true,
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

PostSchema.index({
  title: "text",
  excerpt: "text",
  content: "text",
  topics: "text",
});

PostSchema.index({ createdAt: -1 });
PostSchema.index({ views: -1 });

const Post = models.Post || model("Post", PostSchema);

export default Post;