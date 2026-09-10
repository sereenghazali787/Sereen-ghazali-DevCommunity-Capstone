import mongoose, { Schema, model, models } from "mongoose";

const CommunitySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    image: {
      type: String,
      default: "",
    },

    topics: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

CommunitySchema.index({ name: "text", description: "text", topics: "text" });

const Community =
  models.Community || model("Community", CommunitySchema);

export default Community;