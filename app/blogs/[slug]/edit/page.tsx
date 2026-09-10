import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";

import connectDB from "@/lib/db";
import Post from "@/models/Post";
import Community from "@/models/Community";

import EditPostForm from "@/components/EditPostForm";

type EditBlogPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EditBlogPage({
  params,
}: EditBlogPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const { slug } = await params;

  await connectDB();

  const post = await Post.findOne({
    slug,
    published: true,
  }).lean();

  if (!post) {
    notFound();
  }

  if (post.author.toString() !== session.user.id) {
    redirect(`/blogs/${post.slug}`);
  }

  const communitiesFromDB = await Community.find()
    .select("_id name")
    .sort({ name: 1 })
    .lean();

  const communities = communitiesFromDB.map((community) => ({
    _id: community._id.toString(),
    name: community.name,
  }));

  const postData = {
    _id: post._id.toString(),
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    communityId: post.community.toString(),
    topics: post.topics,
  };

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-12">
      <div>
        <p className="text-sm text-muted">
          Editing as @{session.user.username}
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Edit Blog
        </h1>

        <p className="mt-3 text-muted">
          Update your blog post and save your changes.
        </p>
      </div>

      <EditPostForm
        post={postData}
        communities={communities}
      />
    </main>
  );
}