import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Community from "@/models/Community";
import "@/models/User";
import CommunityJoinButton from "@/components/CommunityJoinButton";
import { notFound } from "next/navigation";

type CommunityPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CommunityPage({
  params,
}: CommunityPageProps) {
  const { slug } = await params;

  await connectDB();

  const community = await Community.findOne({
    slug,
  })
    .populate("creator", "name username image")
    .lean();

  if (!community) {
    notFound();
  }

  const session = await auth();

  const isMember =
    session?.user?.id &&
    community.members.some(
      (memberId: unknown) =>
        String(memberId) === session.user.id
    );

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-12">
      <div className="rounded-xl border border-border bg-surface p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {community.name}
            </h1>

            <p className="mt-4 leading-7 text-muted">
              {community.description}
            </p>
          </div>

          {session?.user && (
            <CommunityJoinButton
              communityId={community._id.toString()}
              initialIsMember={Boolean(isMember)}
            />
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {community.topics.map((topic: string) => (
            <span
              key={topic}
              className="rounded-full border border-border px-3 py-1 text-sm text-muted"
            >
              #{topic}
            </span>
          ))}
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <p className="text-sm text-muted">
            Created by{" "}
            <span className="text-foreground">
              {community.creator?.name ?? "Unknown"}
            </span>
          </p>

          <p className="mt-2 text-sm text-muted">
            {community.members.length} member
            {community.members.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>
    </main>
  );
}