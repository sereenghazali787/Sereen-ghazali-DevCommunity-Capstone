import { auth } from "@/auth";
import { redirect } from "next/navigation";

import connectDB from "@/lib/db";
import Community from "@/models/Community";
import CreatePostForm from "@/components/CreatePostForm";

export default async function CreatePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  await connectDB();

  const communitiesFromDB = await Community.find()
    .select("_id name")
    .sort({ name: 1 })
    .lean();

  const communities = communitiesFromDB.map((community) => ({
    _id: community._id.toString(),
    name: community.name,
  }));

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-12">
      <div>
        <p className="text-sm text-muted">
          Publishing as @{session.user.username}
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Create Blog
        </h1>

        <p className="mt-3 text-muted">
          Share technical knowledge with the DevCommunity.
        </p>
      </div>

      <CreatePostForm communities={communities} />
    </main>
  );
}