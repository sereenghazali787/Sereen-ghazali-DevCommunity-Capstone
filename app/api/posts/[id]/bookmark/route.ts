import mongoose from "mongoose";

import { auth } from "@/auth";
import connectDB from "@/lib/db";

import Post from "@/models/Post";
import Bookmark from "@/models/Bookmark";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// ADD BOOKMARK
export async function POST(
  request: Request,
  { params }: RouteContext
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { message: "You must be signed in to bookmark a post" },
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

    await connectDB();

    const post = await Post.findById(id);

    if (!post) {
      return Response.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    const existingBookmark = await Bookmark.findOne({
      user: session.user.id,
      post: id,
    });

    if (existingBookmark) {
      return Response.json(
        { message: "Post is already bookmarked" },
        { status: 409 }
      );
    }

    const bookmark = await Bookmark.create({
      user: session.user.id,
      post: id,
    });

    return Response.json(
      {
        message: "Post bookmarked successfully",
        data: bookmark,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to bookmark post:", error);

    return Response.json(
      { message: "Failed to bookmark post" },
      { status: 500 }
    );
  }
}

// REMOVE BOOKMARK
export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { message: "You must be signed in to remove a bookmark" },
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

    await connectDB();

    const bookmark = await Bookmark.findOne({
      user: session.user.id,
      post: id,
    });

    if (!bookmark) {
      return Response.json(
        { message: "Bookmark not found" },
        { status: 404 }
      );
    }

    await Bookmark.findByIdAndDelete(bookmark._id);

    return Response.json(
      { message: "Bookmark removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to remove bookmark:", error);

    return Response.json(
      { message: "Failed to remove bookmark" },
      { status: 500 }
    );
  }
}