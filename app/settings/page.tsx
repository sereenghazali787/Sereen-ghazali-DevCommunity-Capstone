import { auth } from "@/auth";
import { redirect } from "next/navigation";

import connectDB from "@/lib/db";
import User from "@/models/User";

import ProfileSettingsForm from "@/components/ProfileSettingsForm";

export const dynamic = "force-dynamic";
export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  await connectDB();

  const user = await User.findById(
    session.user.id
  ).lean();

  if (!user) {
    redirect("/");
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Profile Settings
        </h1>

        <p className="mt-2 text-muted">
          Update the information shown on
          your public developer profile.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-8">
        <ProfileSettingsForm
          initialName={user.name}
          initialUsername={
            user.username
          }
          initialBio={user.bio ?? ""}
          initialGithubUrl={
            user.githubUrl ?? ""
          }
        />
      </div>
    </main>
  );
}