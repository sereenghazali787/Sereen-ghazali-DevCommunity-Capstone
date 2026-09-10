"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Community = {
  _id: string;
  name: string;
};

type CreatePostFormProps = {
  communities: Community[];
};

export default function CreatePostForm({
  communities,
}: CreatePostFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [communityId, setCommunityId] = useState("");
  const [topics, setTopics] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    const topicArray = topics
      .split(",")
      .map((topic) => topic.trim())
      .filter(Boolean);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          communityId,
          topics: topicArray,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const messages = Object.values(data.errors)
            .flat()
            .join(" ");

          setError(messages || data.message);
        } else {
          setError(data.message || "Something went wrong.");
        }

        return;
      }

      router.push(`/blogs/${data.data.slug}`);
      router.refresh();
    } catch {
      setError("Unable to create the post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-6 rounded-xl border border-border bg-surface p-6"
    >
      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium"
        >
          Title
        </label>

        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Getting Started with Next.js"
          className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
        />
      </div>

      <div>
        <label
          htmlFor="excerpt"
          className="mb-2 block text-sm font-medium"
        >
          Excerpt
        </label>

        <textarea
          id="excerpt"
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
          placeholder="Write a short description of your blog..."
          rows={3}
          className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="mb-2 block text-sm font-medium"
        >
          Content
        </label>

        <textarea
          id="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write your blog content..."
          rows={10}
          className="w-full resize-y rounded-lg border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
        />
      </div>

      <div>
        <label
          htmlFor="community"
          className="mb-2 block text-sm font-medium"
        >
          Community
        </label>
      <select
  id="community"
  value={communityId}
  onChange={(event) => setCommunityId(event.target.value)}
  className="w-full rounded-lg border border-border bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-primary"
>
  <option value="" className="bg-zinc-900 text-gray-400">
    Select a community
  </option>

  {communities.map((community) => (
    <option
      key={community._id}
      value={community._id}
      className="bg-zinc-900 text-white"
    >
      {community.name}
    </option>
  ))}
</select>
      </div>

      <div>
        <label
          htmlFor="topics"
          className="mb-2 block text-sm font-medium"
        >
          Topics
        </label>

        <input
          id="topics"
          type="text"
          value={topics}
          onChange={(event) => setTopics(event.target.value)}
          placeholder="nextjs, react, typescript"
          className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
        />

        <p className="mt-2 text-xs text-muted">
          Separate topics with commas. Maximum 5 topics.
        </p>
      </div>
      {error && (
        <div className="rounded-lg border border-red-500/30 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg border border-primary bg-primary px-5 py-3 font-semibold text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Publishing..." : "Publish Blog"}
      </button>
    </form>
  );
}