"use client";

import { useEffect } from "react";
import Link from "next/link";

type ErrorPageProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center px-6 py-12">
      <div className="max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-red-400">
          Something went wrong
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          We couldn&apos;t load this page
        </h1>

        <p className="mt-4 leading-7 text-muted">
          An unexpected error occurred while processing
          your request. You can try again or return to
          the homepage.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-80"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="rounded-lg border border-border px-5 py-3 text-sm text-foreground transition hover:bg-surface"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}