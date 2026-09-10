import connectDB from "@/lib/db";
import User from "@/models/User";
import Post from "@/models/Post";
import "@/models/Community";
import { notFound } from "next/navigation";
import Link from "next/link";

type ProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

export default async function ProfilePage({
  params,
}: ProfilePageProps) {
  const { username } = await params;

  await connectDB();

  const user = await User.findOne({
    username: username.toLowerCase(),
  }).lean();

  if (!user) {
    notFound();
  }

  const posts = await Post.find({
    author: user._id,
    published: true,
  })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-12">
      <section className="rounded-xl border border-border bg-surface p-8">
        <div>
          <p className="text-sm text-muted">@{user.username}</p>

          <h1 className="mt-2 text-3xl font-bold">
            {user.name}
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-muted">
            {user.bio || "This developer has not added a bio yet."}
          </p>

          {user.githubUrl && (
            <a
              href={user.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm text-primary hover:underline"
            >
              GitHub Profile
            </a>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">
          Published Blogs
        </h2>

        {posts.length === 0 ? (
          <div className="mt-5 rounded-xl border border-border bg-surface p-6">
            <p className="text-muted">
              This developer has not published any blogs yet.
            </p>
          </div>
        ) : (
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post._id.toString()}
                href={`/blogs/${post.slug}`}
                className="rounded-xl border border-border bg-surface p-6 transition hover:border-primary"
              >
                <h3 className="text-lg font-semibold">
                  {post.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-muted">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}