import mongoose from "mongoose";

import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Post from "@/models/Post";
import Community from "@/models/Community";
import { postSchema } from "@/schemas/postSchema";

const updatePostSchema = postSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

type RouteContext = {
  params: Promise<{ id: string }>;
};

// EDIT A POST
export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const session = await auth();

    // 401 = user is not logged in
    if (!session?.user?.id) {
      return Response.json(
        { message: "You must be signed in to edit a post" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Prevent invalid MongoDB IDs
    if (!mongoose.isValidObjectId(id)) {
      return Response.json(
        { message: "Invalid post ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const result = updatePostSchema.safeParse(body);

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

    // Post does not exist
    if (!post) {
      return Response.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    // 403 = logged in, but this is not their post
    if (post.author.toString() !== session.user.id) {
      return Response.json(
        { message: "You are not allowed to edit this post" },
        { status: 403 }
      );
    }

    const {
      title,
      excerpt,
      content,
      communityId,
      topics,
    } = result.data;

    if (communityId) {
      const community = await Community.findById(communityId);

      if (!community) {
        return Response.json(
          { message: "Community not found" },
          { status: 404 }
        );
      }

      post.community = communityId;
    }

    if (title !== undefined) {
      post.title = title;
    }

    if (excerpt !== undefined) {
      post.excerpt = excerpt;
    }

    if (content !== undefined) {
      post.content = content;
    }

    if (topics !== undefined) {
      post.topics = topics.map((topic) =>
        topic.toLowerCase().trim()
      );
    }

    await post.save();

    return Response.json(
      {
        message: "Post updated successfully",
        data: post,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update post:", error);

    return Response.json(
      { message: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE A POST
export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const session = await auth();

    // 401 = not authenticated
    if (!session?.user?.id) {
      return Response.json(
        { message: "You must be signed in to delete a post" },
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

    // Logged in, but does not own the post
    if (post.author.toString() !== session.user.id) {
      return Response.json(
        { message: "You are not allowed to delete this post" },
        { status: 403 }
      );
    }

    await Post.findByIdAndDelete(id);

    return Response.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete post:", error);

    return Response.json(
      { message: "Failed to delete post" },
      { status: 500 }
    );
  }
}