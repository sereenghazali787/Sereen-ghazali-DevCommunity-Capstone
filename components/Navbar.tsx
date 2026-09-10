import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="border-b border-border bg-background/95">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          DevCommunity
        </Link>

        <div className="flex items-center gap-6 text-sm text-muted">
          <Link
            href="/communities"
            className="transition hover:text-foreground"
          >
            Communities
          </Link>

          <Link
            href="/blogs"
            className="transition hover:text-foreground"
          >
            Blogs
          </Link>

          {session?.user ? (
            <>
            <Link
  href="/create"
  className="transition hover:text-foreground"
>
  Create Blog
</Link>
              <Link
                href="/dashboard"
                className="transition hover:text-foreground"
              >
                Dashboard
              </Link>

              <Link
                href={`/profile/${session.user.username}`}
                className="transition hover:text-foreground"
              >
                @{session.user.username}
              </Link>

              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <button
                  type="submit"
                  className="rounded-lg border border-border px-4 py-2 text-foreground transition hover:bg-surface"
                >
                  Sign Out
                </button>
              </form>
            </>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn();
              }}
            >
              <button
                type="submit"
                className="rounded-lg border border-border px-4 py-2 text-foreground transition hover:bg-surface"
              >
                Sign In
              </button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
}