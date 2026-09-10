import { auth } from "@/auth";

import connectDB from "@/lib/db";

import Post from "@/models/Post";
import Community from "@/models/Community";

import "@/models/User";

import { postSchema } from "@/schemas/postSchema";

// GET published blog posts with search and topic filtering
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const q =
      searchParams.get("q")?.trim() || "";

    const topic =
      searchParams
        .get("topic")
        ?.trim()
        .toLowerCase() || "";

    const filter: {
      published: boolean;
      $text?: {
        $search: string;
      };
      topics?: string;
    } = {
      published: true,
    };

    // Full-text search using MongoDB text index
    if (q) {
      filter.$text = {
        $search: q,
      };
    }

    // Filter by one topic
    if (topic) {
      filter.topics = topic;
    }

    const posts = await Post.find(filter)
      .populate(
        "author",
        "name username image"
      )
      .populate(
        "community",
        "name slug"
      )
      .sort({
        createdAt: -1,
      });

    return Response.json(
      {
        data: posts,
        filters: {
          q,
          topic,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Failed to fetch posts:",
      error
    );

    return Response.json(
      {
        message:
          "Failed to fetch posts",
      },
      {
        status: 500,
      }
    );
  }
}

// CREATE a new blog post
export async function POST(
  request: Request
) {
  try {
    const session = await auth();

    // User must be signed in
    if (!session?.user?.id) {
      return Response.json(
        {
          message:
            "You must be signed in to create a post",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    // Validate request body using Zod
    const result =
      postSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          message:
            "Validation failed",

          errors:
            result.error.flatten()
              .fieldErrors,
        },
        {
          status: 400,
        }
      );
    }

    const {
      title,
      excerpt,
      content,
      communityId,
      topics,
    } = result.data;

    await connectDB();

    // Make sure the selected community exists
    const community =
      await Community.findById(
        communityId
      );

    if (!community) {
      return Response.json(
        {
          message:
            "Community not found",
        },
        {
          status: 404,
        }
      );
    }

    // Create URL-friendly slug
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(
        /[^a-z0-9]+/g,
        "-"
      )
      .replace(
        /^-+|-+$/g,
        ""
      );

    let slug =
      baseSlug || "post";

    let counter = 1;

    // Make sure every slug is unique
    while (
      await Post.findOne({
        slug,
      })
    ) {
      slug = `${
        baseSlug || "post"
      }-${counter}`;

      counter++;
    }

    const post =
      await Post.create({
        title,
        slug,
        excerpt,
        content,

        // Author comes from the authenticated session
        author:
          session.user.id,

        community:
          communityId,

        topics: topics.map(
          (topic) =>
            topic
              .toLowerCase()
              .trim()
        ),

        published: true,
      });

    return Response.json(
      {
        message:
          "Post created successfully",

        data: post,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Failed to create post:",
      error
    );

    return Response.json(
      {
        message:
          "Failed to create post",
      },
      {
        status: 500,
      }
    );
  }
}