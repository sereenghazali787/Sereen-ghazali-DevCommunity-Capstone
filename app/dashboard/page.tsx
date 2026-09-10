import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import connectDB from "@/lib/db";
import Post from "@/models/Post";
import Community from "@/models/Community";
import Bookmark from "@/models/Bookmark";
import User from "@/models/User";

import "@/models/Comment";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  await connectDB();

  const user = await User.findById(
    session.user.id
  ).lean();

  if (!user) {
    redirect("/");
  }

  const [
    posts,
    joinedCommunities,
    bookmarkCount,
  ] = await Promise.all([
    Post.find({
      author: session.user.id,
    })
      .populate(
        "community",
        "name slug"
      )
      .sort({
        createdAt: -1,
      })
      .lean(),

    Community.find({
      members: session.user.id,
    })
      .sort({
        createdAt: -1,
      })
      .lean(),

    Bookmark.countDocuments({
      user: session.user.id,
    }),
  ]);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-12">
      {/* HEADER */}
      <div className="mb-10">
        <p className="text-sm text-primary">
          Developer Dashboard
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Welcome, {user.name}
        </h1>

        <p className="mt-2 text-muted">
          Manage your content and community
          activity from one place.
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-6">
          <p className="text-sm text-muted">
            Your Blogs
          </p>

          <p className="mt-2 text-3xl font-bold">
            {posts.length}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6">
          <p className="text-sm text-muted">
            Joined Communities
          </p>

          <p className="mt-2 text-3xl font-bold">
            {joinedCommunities.length}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6">
          <p className="text-sm text-muted">
            Bookmarks
          </p>

          <p className="mt-2 text-3xl font-bold">
            {bookmarkCount}
          </p>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">
          Quick Actions
        </h2>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/create"
            className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-80"
          >
            Create Blog
          </Link>

          <Link
            href="/bookmarks"
            className="rounded-lg border border-border px-5 py-3 text-sm transition hover:bg-surface"
          >
            View Bookmarks
          </Link>

          <Link
            href="/settings"
            className="rounded-lg border border-border px-5 py-3 text-sm transition hover:bg-surface"
          >
            Settings
          </Link>

          <Link
            href={`/profile/${user.username}`}
            className="rounded-lg border border-border px-5 py-3 text-sm transition hover:bg-surface"
          >
            View Public Profile
          </Link>
        </div>
      </section>

      {/* YOUR BLOGS */}
      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Your Blogs
          </h2>

          <Link
            href="/create"
            className="text-sm text-primary hover:underline"
          >
            Write a new blog
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="mt-4 rounded-xl border border-border bg-surface p-6">
            <p className="text-muted">
              You have not published any blogs yet.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {posts.map((post) => (
              <div
                key={post._id.toString()}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <div className="flex flex-wrap gap-2">
                  {post.topics.map(
                    (topic: string) => (
                      <span
                        key={topic}
                        className="rounded-full border border-border px-3 py-1 text-xs text-muted"
                      >
                        #{topic}
                      </span>
                    )
                  )}
                </div>

                <h3 className="mt-4 text-lg font-semibold">
                  {post.title}
                </h3>

                <p className="mt-2 text-sm text-muted">
                  {post.community?.name ??
                    "No community"}
                </p>

                <div className="mt-5 flex gap-4 text-sm">
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="text-primary hover:underline"
                  >
                    View
                  </Link>

                  <Link
                    href={`/blogs/${post.slug}/edit`}
                    className="text-foreground hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* JOINED COMMUNITIES */}
      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Joined Communities
          </h2>

          <Link
            href="/communities"
            className="text-sm text-primary hover:underline"
          >
            Explore communities
          </Link>
        </div>

        {joinedCommunities.length === 0 ? (
          <div className="mt-4 rounded-xl border border-border bg-surface p-6">
            <p className="text-muted">
              You have not joined any communities yet.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {joinedCommunities.map(
              (community) => (
                <Link
                  key={community._id.toString()}
                  href={`/communities/${community.slug}`}
                  className="rounded-xl border border-border bg-surface p-6 transition hover:border-primary"
                >
                  <h3 className="font-semibold">
                    {community.name}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm text-muted">
                    {community.description}
                  </p>

                  <p className="mt-4 text-sm text-muted">
                    {community.members.length} member
                    {community.members.length === 1
                      ? ""
                      : "s"}
                  </p>
                </Link>
              )
            )}
          </div>
        )}
      </section>
    </main>
  );
}