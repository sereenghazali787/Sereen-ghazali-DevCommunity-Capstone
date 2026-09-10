"use client";

import { useState } from "react";

type BookmarkButtonProps = {
  postId: string;
  initialBookmarked: boolean;
};

export default function BookmarkButton({
  postId,
  initialBookmarked,
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] =
    useState(initialBookmarked);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleBookmark() {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/posts/${postId}/bookmark`,
        {
          method: isBookmarked ? "DELETE" : "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Unable to update bookmark."
        );
        return;
      }

      setIsBookmarked((current) => !current);
    } catch {
      setError(
        "Unable to update bookmark. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleBookmark}
        disabled={isLoading}
        className={
          isBookmarked
            ? "rounded-lg border border-primary bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-80 disabled:opacity-50"
            : "rounded-lg border border-border px-4 py-2 text-sm text-foreground transition hover:bg-background disabled:opacity-50"
        }
      >
        {isLoading
          ? "Please wait..."
          : isBookmarked
            ? "Bookmarked"
            : "Bookmark"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}