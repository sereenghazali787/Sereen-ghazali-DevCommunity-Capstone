import mongoose from "mongoose";

import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Comment from "@/models/Comment";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// DELETE A COMMENT
export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const session = await auth();

    // 401 = user is not signed in
    if (!session?.user?.id) {
      return Response.json(
        { message: "You must be signed in to delete a comment" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Make sure the comment ID is a valid MongoDB ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return Response.json(
        { message: "Invalid comment ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const comment = await Comment.findById(id);

    if (!comment) {
      return Response.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    // 403 = signed in, but the comment belongs to another user
    if (comment.author.toString() !== session.user.id) {
      return Response.json(
        {
          message:
            "You are not allowed to delete this comment",
        },
        { status: 403 }
      );
    }

    await Comment.findByIdAndDelete(id);

    return Response.json(
      { message: "Comment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete comment:", error);

    return Response.json(
      { message: "Failed to delete comment" },
      { status: 500 }
    );
  }
}