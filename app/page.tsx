export default function Home() {
  return (
    <main className="min-h-screen bg-[#090d14] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-indigo-400">
            DevCommunity
          </p>

          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Learn. Share. Build with developers.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
            Discover developer communities, explore technical blogs, share your
            knowledge, and connect with developers around the technologies you
            care about.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="rounded-lg bg-indigo-600 px-5 py-3 font-medium transition hover:bg-indigo-500">
              Explore Communities
            </button>

            <button className="rounded-lg border border-gray-700 px-5 py-3 font-medium transition hover:bg-gray-900">
              Explore Blogs
            </button>
          </div>
        </div>

        <section className="mt-20">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Featured Communities</h2>
              <p className="mt-1 text-gray-400">
                Find communities built around technologies you love.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <CommunityCard
              name="React"
              description="Discuss React, components, hooks, and modern frontend development."
              members="12.4k"
              tag="Frontend"
            />

            <CommunityCard
              name="Next.js"
              description="Explore App Router, Server Components, APIs, rendering, and deployment."
              members="8.7k"
              tag="Full Stack"
            />

            <CommunityCard
              name="TypeScript"
              description="Learn TypeScript patterns, typing strategies, and safer JavaScript."
              members="10.1k"
              tag="Language"
            />
          </div>
        </section>

        <section className="mt-20">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold">Latest Blogs</h2>
            <p className="mt-1 text-gray-400">
              Fresh technical content from the community.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <BlogCard
              title="Understanding Server Components in Next.js"
              description="A practical look at when Server Components make sense and when client boundaries are actually needed."
              author="Alex Developer"
              topic="Next.js"
            />

            <BlogCard
              title="MongoDB Modeling for Real Applications"
              description="How to think about references, embedded data, ownership, and query patterns before designing your schemas."
              author="Maya Codes"
              topic="MongoDB"
            />
          </div>
        </section>
      </section>
    </main>
  );
}

type CommunityCardProps = {
  name: string;
  description: string;
  members: string;
  tag: string;
};

function CommunityCard({
  name,
  description,
  members,
  tag,
}: CommunityCardProps) {
  return (
    <article className="rounded-xl border border-gray-800 bg-[#111722] p-6 transition hover:border-gray-700">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-600/20 text-lg font-bold text-indigo-400">
          {name.charAt(0)}
        </div>

        <span className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300">
          {tag}
        </span>
      </div>

      <h3 className="text-xl font-semibold">{name}</h3>

      <p className="mt-2 leading-6 text-gray-400">{description}</p>

      <p className="mt-5 text-sm text-gray-500">{members} members</p>
    </article>
  );
}

type BlogCardProps = {
  title: string;
  description: string;
  author: string;
  topic: string;
};

function BlogCard({
  title,
  description,
  author,
  topic,
}: BlogCardProps) {
  return (
    <article className="rounded-xl border border-gray-800 bg-[#111722] p-6 transition hover:border-gray-700">
      <span className="text-sm font-medium text-indigo-400">{topic}</span>

      <h3 className="mt-3 text-xl font-semibold">{title}</h3>

      <p className="mt-3 leading-6 text-gray-400">{description}</p>

      <div className="mt-6 border-t border-gray-800 pt-4 text-sm text-gray-500">
        By {author}
      </div>
    </article>
  );
}