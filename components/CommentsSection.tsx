"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CommentAuthor = {
  _id?: string;
  name?: string | null;
  username?: string | null;
  image?: string | null;
};

type CommentData = {
  _id: string;
  content: string;
  createdAt: string;
  author: CommentAuthor;
};

type CommentsSectionProps = {
  postId: string;
  initialComments: CommentData[];
  isSignedIn: boolean;
  currentUserId?: string;
};

export default function CommentsSection({
  postId,
  initialComments,
  isSignedIn,
  currentUserId,
}: CommentsSectionProps) {
  const router = useRouter();

  const [comments, setComments] =
    useState<CommentData[]>(initialComments);

  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const messages = Object.values(data.errors)
            .flat()
            .join(" ");

          setError(
            messages || data.message || "Validation failed."
          );
        } else {
          setError(
            data.message || "Unable to publish comment."
          );
        }

        return;
      }

      const newComment: CommentData = {
        _id: data.data._id,
        content: data.data.content,
        createdAt: data.data.createdAt,
        author: {
          _id: data.data.author?._id,
          name: data.data.author?.name,
          username: data.data.author?.username,
          image: data.data.author?.image,
        },
      };

      setComments((currentComments) => [
        newComment,
        ...currentComments,
      ]);

      setContent("");
      router.refresh();
    } catch {
      setError(
        "Unable to publish your comment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(commentId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeletingId(commentId);

    try {
      const response = await fetch(
        `/api/comments/${commentId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Unable to delete comment."
        );
        return;
      }

      setComments((currentComments) =>
        currentComments.filter(
          (comment) => comment._id !== commentId
        )
      );

      router.refresh();
    } catch {
      setError(
        "Unable to delete the comment. Please try again."
      );
    } finally {
      setDeletingId("");
    }
  }

  return (
    <section className="mt-10 border-t border-border pt-8">
      <h2 className="text-2xl font-bold">
        Comments
      </h2>

      <p className="mt-2 text-sm text-muted">
        {comments.length} comment
        {comments.length === 1 ? "" : "s"}
      </p>

      {isSignedIn ? (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-xl border border-border bg-background p-5"
        >
          <label
            htmlFor="comment"
            className="mb-2 block text-sm font-medium"
          >
            Add a comment
          </label>

          <textarea
            id="comment"
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            rows={4}
            placeholder="Share your thoughts..."
            className="w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 outline-none transition focus:border-primary"
          />

          {error && (
            <p className="mt-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 rounded-lg border border-primary bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Publishing..."
              : "Post Comment"}
          </button>
        </form>
      ) : (
        <div className="mt-6 rounded-xl border border-border bg-background p-5">
          <p className="text-sm text-muted">
            Sign in to join the discussion.
          </p>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {comments.length === 0 ? (
          <div className="rounded-xl border border-border bg-background p-5">
            <p className="text-sm text-muted">
              No comments yet. Be the first to comment.
            </p>
          </div>
        ) : (
          comments.map((comment) => {
            const isCommentOwner =
              currentUserId &&
              comment.author?._id === currentUserId;

            return (
              <div
                key={comment._id}
                className="rounded-xl border border-border bg-background p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">
                      {comment.author?.name ??
                        "Developer"}
                    </p>

                    {comment.author?.username && (
                      <p className="text-xs text-muted">
                        @{comment.author.username}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="text-xs text-muted">
                      {new Date(
                        comment.createdAt
                      ).toLocaleDateString()}
                    </p>

                    {isCommentOwner && (
                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(comment._id)
                        }
                        disabled={
                          deletingId === comment._id
                        }
                        className="text-xs text-red-400 transition hover:text-red-300 disabled:opacity-50"
                      >
                        {deletingId === comment._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    )}
                  </div>
                </div>

                <p className="mt-4 leading-7 text-muted">
                  {comment.content}
                </p>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}