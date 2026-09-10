export default function Loading() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-12">
      <div className="animate-pulse">
        {/* Page heading skeleton */}
        <div className="h-8 w-52 rounded bg-surface" />

        <div className="mt-3 h-4 w-80 max-w-full rounded bg-surface" />

        {/* Card skeletons */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-surface p-6"
            >
              <div className="h-4 w-24 rounded bg-border" />

              <div className="mt-5 h-6 w-3/4 rounded bg-border" />

              <div className="mt-4 space-y-3">
                <div className="h-4 w-full rounded bg-border" />
                <div className="h-4 w-5/6 rounded bg-border" />
                <div className="h-4 w-2/3 rounded bg-border" />
              </div>

              <div className="mt-6 h-4 w-32 rounded bg-border" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}