import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import connectDB from "@/lib/db";
import Bookmark from "@/models/Bookmark";

import "@/models/Post";
import "@/models/User";
import "@/models/Community";

export default async function BookmarksPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  await connectDB();

  const bookmarks = await Bookmark.find({
    user: session.user.id,
  })
    .populate({
      path: "post",
      match: { published: true },
      populate: [
        {
          path: "author",
          select: "name username image",
        },
        {
          path: "community",
          select: "name slug",
        },
      ],
    })
    .sort({ createdAt: -1 })
    .lean();

  const validBookmarks = bookmarks.filter(
    (bookmark) => bookmark.post
  );

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">
          Bookmarks
        </h1>

        <p className="mt-3 text-muted">
          Your saved technical articles are collected here.
        </p>
      </div>

      {validBookmarks.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-8">
          <p className="text-muted">
            You have not bookmarked any posts yet.
          </p>

          <Link
            href="/blogs"
            className="mt-4 inline-block text-sm text-primary hover:underline"
          >
            Explore blogs
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {validBookmarks.map((bookmark) => {
            const post = bookmark.post;

            return (
              <Link
                key={bookmark._id.toString()}
                href={`/blogs/${post.slug}`}
                className="block rounded-xl border border-border bg-surface p-6 transition hover:-translate-y-1 hover:border-primary"
              >
                <div className="mb-3 flex flex-wrap gap-2">
                  {post.topics.map((topic: string) => (
                    <span
                      key={topic}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted"
                    >
                      #{topic}
                    </span>
                  ))}
                </div>

                <h2 className="text-xl font-semibold">
                  {post.title}
                </h2>

                <p className="mt-3 leading-6 text-muted">
                  {post.excerpt}
                </p>

                <div className="mt-5 text-sm text-muted">
                  <p>
                    By{" "}
                    <span className="text-foreground">
                      {post.author?.name ?? "Unknown"}
                    </span>
                  </p>

                  <p className="mt-1">
                    {post.community?.name ??
                      "No community"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}