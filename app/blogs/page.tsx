import Link from "next/link";

import connectDB from "@/lib/db";
import Post from "@/models/Post";

import "@/models/User";
import "@/models/Community";

type BlogsPageProps = {
  searchParams: Promise<{
    q?: string;
    topic?: string;
  }>;
};

export default async function BlogsPage({
  searchParams,
}: BlogsPageProps) {
  const params = await searchParams;

  const q = params.q?.trim() || "";
  const topic =
    params.topic?.trim().toLowerCase() || "";

  await connectDB();

  const filter: {
    published: boolean;
    $text?: {
      $search: string;
    };
    topics?: string;
  } = {
    published: true,
  };

  if (q) {
    filter.$text = {
      $search: q,
    };
  }

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
    })
    .lean();

  // Get all available topics for the filter dropdown
  const availableTopics: string[] =
    await Post.distinct("topics", {
      published: true,
    });

  availableTopics.sort();

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">
          Explore Blogs
        </h1>

        <p className="mt-2 text-muted">
          Search technical articles and discover
          content by topic.
        </p>
      </div>

      <form
        action="/blogs"
        method="GET"
        className="mb-10 grid gap-4 rounded-xl border border-border bg-surface p-5 md:grid-cols-[1fr_220px_auto]"
      >
        <div>
          <label
            htmlFor="q"
            className="mb-2 block text-sm font-medium"
          >
            Search
          </label>

          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search Next.js, MongoDB..."
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary"
          />
        </div>

        <div>
          <label
            htmlFor="topic"
            className="mb-2 block text-sm font-medium"
          >
            Topic
          </label>

          <select
            id="topic"
            name="topic"
            defaultValue={topic}
            className="w-full rounded-lg border border-border bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-primary"
          >
            <option
              value=""
              className="bg-zinc-900 text-gray-400"
            >
              All topics
            </option>

            {availableTopics.map(
              (availableTopic) => (
                <option
                  key={availableTopic}
                  value={availableTopic}
                  className="bg-zinc-900 text-white"
                >
                  #{availableTopic}
                </option>
              )
            )}
          </select>
        </div>

        <div className="flex items-end gap-3">
          <button
            type="submit"
            className="rounded-lg border border-primary bg-primary px-5 py-3 font-semibold text-white transition hover:opacity-80"
          >
            Search
          </button>

          {(q || topic) && (
            <Link
              href="/blogs"
              className="rounded-lg border border-border px-5 py-3 text-sm text-foreground transition hover:bg-background"
            >
              Clear
            </Link>
          )}
        </div>
      </form>

      {(q || topic) && (
        <div className="mb-6">
          <p className="text-sm text-muted">
            Found{" "}
            <span className="font-semibold text-foreground">
              {posts.length}
            </span>{" "}
            result
            {posts.length === 1 ? "" : "s"}

            {q && (
              <>
                {" "}for{" "}
                <span className="text-foreground">
                  &quot;{q}&quot;
                </span>
              </>
            )}

            {topic && (
              <>
                {" "}in{" "}
                <span className="text-foreground">
                  #{topic}
                </span>
              </>
            )}
          </p>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-8">
          <h2 className="text-lg font-semibold">
            No blogs found
          </h2>

          <p className="mt-2 text-muted">
            Try a different search term or topic.
          </p>

          {(q || topic) && (
            <Link
              href="/blogs"
              className="mt-4 inline-block text-sm text-primary hover:underline"
            >
              View all blogs
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post._id.toString()}
              href={`/blogs/${post.slug}`}
              className="block rounded-xl border border-border bg-surface p-6 transition hover:-translate-y-1 hover:border-primary"
            >
              <div className="mb-3 flex flex-wrap gap-2">
                {post.topics.map(
                  (postTopic: string) => (
                    <span
                      key={postTopic}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted"
                    >
                      #{postTopic}
                    </span>
                  )
                )}
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
                    {post.author?.name ??
                      "Unknown"}
                  </span>
                </p>

                <p className="mt-1">
                  {post.community?.name ??
                    "No community"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}