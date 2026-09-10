import mongoose from "mongoose";
import { z } from "zod";

import { auth } from "@/auth";
import connectDB from "@/lib/db";

import Post from "@/models/Post";
import Comment from "@/models/Comment";
import "@/models/User";

const commentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment must be 1000 characters or less"),
});

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// GET ALL COMMENTS FOR A POST
export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return Response.json(
        { message: "Invalid post ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const post = await Post.findById(id);

    if (!post) {
      return Response.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    const comments = await Comment.find({
      post: id,
    })
      .populate("author", "name username image")
      .sort({ createdAt: -1 });

    return Response.json(
      { data: comments },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch comments:", error);

    return Response.json(
      { message: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// CREATE A COMMENT
export async function POST(
  request: Request,
  { params }: RouteContext
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { message: "You must be signed in to comment" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return Response.json(
        { message: "Invalid post ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const result = commentSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    await connectDB();

    const post = await Post.findById(id);

    if (!post) {
      return Response.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    const comment = await Comment.create({
      content: result.data.content,
      author: session.user.id,
      post: post._id,
    });

    const populatedComment = await Comment.findById(
      comment._id
    ).populate("author", "name username image");

    return Response.json(
      {
        message: "Comment created successfully",
        data: populatedComment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create comment:", error);

    return Response.json(
      { message: "Failed to create comment" },
      { status: 500 }
    );
  }
}