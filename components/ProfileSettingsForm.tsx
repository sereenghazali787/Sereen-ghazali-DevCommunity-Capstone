"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ProfileSettingsFormProps = {
  initialName: string;
  initialUsername: string;
  initialBio: string;
  initialGithubUrl: string;
};

export default function ProfileSettingsForm({
  initialName,
  initialUsername,
  initialBio,
  initialGithubUrl,
}: ProfileSettingsFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [username, setUsername] =
    useState(initialUsername);
  const [bio, setBio] = useState(initialBio);
  const [githubUrl, setGithubUrl] =
    useState(initialGithubUrl);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "/api/profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            username,
            bio,
            githubUrl,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const firstError =
            Object.values(
              data.errors
            )
              .flat()
              .find(Boolean);

          setError(
            typeof firstError ===
              "string"
              ? firstError
              : data.message ||
                  "Unable to update profile."
          );
        } else {
          setError(
            data.message ||
              "Unable to update profile."
          );
        }

        return;
      }

      setSuccess(
        "Profile updated successfully."
      );

      router.refresh();
    } catch {
      setError(
        "Unable to update profile. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium"
        >
          Name
        </label>

        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary"
        />
      </div>

      <div>
        <label
          htmlFor="username"
          className="mb-2 block text-sm font-medium"
        >
          Username
        </label>

        <input
          id="username"
          type="text"
          value={username}
          onChange={(event) =>
            setUsername(
              event.target.value
            )
          }
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary"
        />

        <p className="mt-2 text-xs text-muted">
          Use lowercase letters,
          numbers, and underscores.
        </p>
      </div>

      <div>
        <label
          htmlFor="bio"
          className="mb-2 block text-sm font-medium"
        >
          Bio
        </label>

        <textarea
          id="bio"
          value={bio}
          onChange={(event) =>
            setBio(event.target.value)
          }
          rows={5}
          placeholder="Tell the community a little about yourself..."
          className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary"
        />

        <p className="mt-2 text-xs text-muted">
          {bio.length}/300 characters
        </p>
      </div>

      <div>
        <label
          htmlFor="githubUrl"
          className="mb-2 block text-sm font-medium"
        >
          GitHub Profile URL
        </label>

        <input
          id="githubUrl"
          type="url"
          value={githubUrl}
          onChange={(event) =>
            setGithubUrl(
              event.target.value
            )
          }
          placeholder="https://github.com/username"
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">
            {error}
          </p>
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-primary/30 bg-primary/10 p-4">
          <p className="text-sm text-primary">
            {success}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-primary px-5 py-3 font-semibold text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting
          ? "Saving..."
          : "Save Changes"}
      </button>
    </form>
  );
}