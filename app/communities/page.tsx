import Link from "next/link";

import connectDB from "@/lib/db";
import Community from "@/models/Community";

import "@/models/User";

type CommunitiesPageProps = {
  searchParams: Promise<{
    q?: string;
    topic?: string;
  }>;
};

export default async function CommunitiesPage({
  searchParams,
}: CommunitiesPageProps) {
  const params = await searchParams;

  const q = params.q?.trim() || "";
  const topic =
    params.topic?.trim().toLowerCase() || "";

  await connectDB();

  const filter: {
    $text?: {
      $search: string;
    };
    topics?: string;
  } = {};

  // MongoDB full-text search
  if (q) {
    filter.$text = {
      $search: q,
    };
  }

  // MongoDB topic filtering
  if (topic) {
    filter.topics = topic;
  }

  const communities = await Community.find(filter)
    .populate(
      "creator",
      "name username image"
    )
    .sort({
      createdAt: -1,
    })
    .lean();

  // Get the available community topics
  const availableTopics: string[] =
    await Community.distinct("topics");

  availableTopics.sort();

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">
          Explore Communities
        </h1>

        <p className="mt-2 text-muted">
          Discover developer communities based on
          the technologies and topics you care about.
        </p>
      </div>

      {/* SEARCH + FILTER */}
      <form
        action="/communities"
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
            placeholder="Search communities..."
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
              href="/communities"
              className="rounded-lg border border-border px-5 py-3 text-sm text-foreground transition hover:bg-background"
            >
              Clear
            </Link>
          )}
        </div>
      </form>

      {/* SEARCH RESULT COUNT */}
      {(q || topic) && (
        <div className="mb-6">
          <p className="text-sm text-muted">
            Found{" "}
            <span className="font-semibold text-foreground">
              {communities.length}
            </span>{" "}
            communit
            {communities.length === 1
              ? "y"
              : "ies"}

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

      {/* COMMUNITY RESULTS */}
      {communities.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-8">
          <h2 className="text-lg font-semibold">
            No communities found
          </h2>

          <p className="mt-2 text-muted">
            Try a different search term or topic.
          </p>

          {(q || topic) && (
            <Link
              href="/communities"
              className="mt-4 inline-block text-sm text-primary hover:underline"
            >
              View all communities
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {communities.map((community) => (
            <Link
              key={community._id.toString()}
              href={`/communities/${community.slug}`}
              className="block rounded-xl border border-border bg-surface p-6 transition hover:-translate-y-1 hover:border-primary"
            >
              <h2 className="text-xl font-semibold">
                {community.name}
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted">
                {community.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {community.topics.map(
                  (communityTopic: string) => (
                    <span
                      key={communityTopic}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted"
                    >
                      #{communityTopic}
                    </span>
                  )
                )}
              </div>

              <p className="mt-5 text-sm text-muted">
                Created by{" "}
                <span className="text-foreground">
                  {community.creator?.name ??
                    "Unknown"}
                </span>
              </p>

              <p className="mt-2 text-sm text-muted">
                {community.members.length} member
                {community.members.length === 1
                  ? ""
                  : "s"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}