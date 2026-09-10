import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center px-6 py-12">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          404 Error
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Page not found
        </h1>

        <p className="mx-auto mt-4 max-w-xl leading-7 text-muted">
          The page you are looking for may have been
          removed, renamed, or does not exist.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-80"
          >
            Go Home
          </Link>

          <Link
            href="/blogs"
            className="rounded-lg border border-border px-5 py-3 text-sm text-foreground transition hover:bg-surface"
          >
            Explore Blogs
          </Link>

          <Link
            href="/communities"
            className="rounded-lg border border-border px-5 py-3 text-sm text-foreground transition hover:bg-surface"
          >
            Explore Communities
          </Link>
        </div>
      </div>
    </main>
  );
}