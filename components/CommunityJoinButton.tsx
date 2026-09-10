"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type CommunityJoinButtonProps = {
  communityId: string;
  initialIsMember: boolean;
};

export default function CommunityJoinButton({
  communityId,
  initialIsMember,
}: CommunityJoinButtonProps) {
  const router = useRouter();

  const [isMember, setIsMember] = useState(initialIsMember);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleMembership() {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/communities/${communityId}/join`,
        {
          method: isMember ? "DELETE" : "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Unable to update community membership."
        );
        return;
      }

      setIsMember((current) => !current);

      router.refresh();
    } catch {
      setError(
        "Unable to update community membership. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleMembership}
        disabled={isLoading}
        className={
          isMember
            ? "rounded-lg border border-border px-5 py-2 text-sm font-medium text-foreground transition hover:bg-background disabled:opacity-50"
            : "rounded-lg border border-primary bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:opacity-80 disabled:opacity-50"
        }
      >
        {isLoading
          ? "Please wait..."
          : isMember
            ? "Leave Community"
            : "Join Community"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}