import Link from "next/link";
import { auth } from "@/auth";

import DeletePostButton from "@/components/DeletePostButton";
import CommentsSection from "@/components/CommentsSection";
import BookmarkButton from "@/components/BookmarkButton";

import connectDB from "@/lib/db";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import Bookmark from "@/models/Bookmark";

import "@/models/User";
import "@/models/Community";

import { notFound } from "next/navigation";

type BlogPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BlogPage({
  params,
}: BlogPageProps) {
  const { slug } = await params;

  await connectDB();

const post = await Post.findOneAndUpdate(
  {
    slug,
    published: true,
  },
  {
    $inc: {
      views: 1,
    },
  },
  {
  returnDocument: "after",
  }
)
  .populate("author", "name username image bio")
  .populate("community", "name slug")
  .lean();

if (!post) {
  notFound();
}

  const session = await auth();

  const isOwner =
    session?.user?.id &&
    post.author?._id?.toString() === session.user.id;

  let isBookmarked = false;

  if (session?.user?.id) {
    const existingBookmark = await Bookmark.findOne({
      user: session.user.id,
      post: post._id,
    }).lean();

    isBookmarked = Boolean(existingBookmark);
  }

  const commentsFromDB = await Comment.find({
    post: post._id,
  })
    .populate("author", "name username image")
    .sort({ createdAt: -1 })
    .lean();

  const comments = commentsFromDB.map((comment) => ({
    _id: comment._id.toString(),
    content: comment.content,
    createdAt: comment.createdAt.toISOString(),
    author: {
      _id: comment.author?._id?.toString(),
      name: comment.author?.name ?? null,
      username: comment.author?.username ?? null,
      image: comment.author?.image ?? null,
    },
  }));

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-12">
      <article className="rounded-xl border border-border bg-surface p-8">
        <div className="mb-4 flex flex-wrap gap-2">
          {post.topics.map((topic: string) => (
            <span
              key={topic}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted"
            >
              #{topic}
            </span>
          ))}
        </div>

        <h1 className="text-4xl font-bold tracking-tight">
          {post.title}
        </h1>

        <p className="mt-4 text-muted">
          {post.excerpt}
        </p>

        <div className="mt-6 border-b border-border pb-6 text-sm text-muted">
          <p>
            Written by{" "}
            <Link
              href={`/profile/${post.author?.username}`}
              className="text-foreground hover:underline"
            >
              {post.author?.name ?? "Unknown"}
            </Link>
          </p>

          <p className="mt-1">
            Community:{" "}
            <Link
              href={`/communities/${post.community?.slug}`}
              className="text-foreground hover:underline"
            >
              {post.community?.name ?? "No community"}
            </Link>
          </p>

          <p className="mt-1">
             Views:{" "}
           <span className="text-foreground">
            {post.views}
           </span>
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {session?.user && (
              <BookmarkButton
                postId={post._id.toString()}
                initialBookmarked={isBookmarked}
              />
            )}

            {isOwner && (
              <>
                <Link
                  href={`/blogs/${post.slug}/edit`}
                  className="rounded-lg border border-border px-4 py-2 text-sm text-foreground transition hover:bg-background"
                >
                  Edit
                </Link>

                <DeletePostButton
                  postId={post._id.toString()}
                />
              </>
            )}
          </div>
        </div>

        <div className="mt-8 leading-8">
          <p>{post.content}</p>
        </div>

        <CommentsSection
          postId={post._id.toString()}
          initialComments={comments}
          isSignedIn={Boolean(session?.user)}
          currentUserId={session?.user?.id}
        />
      </article>
    </main>
  );
}