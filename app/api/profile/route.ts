import { revalidatePath } from "next/cache";

import { auth } from "@/auth";

import connectDB from "@/lib/db";

import User from "@/models/User";

import { profileSchema } from "@/schemas/profileSchema";

// UPDATE signed-in user's profile
export async function PATCH(request: Request) {
  try {
    const session = await auth();

    // User must be signed in
    if (!session?.user?.id) {
      return Response.json(
        {
          message: "You must be signed in to update your profile",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    // Validate using Zod
    const result = profileSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors,
        },
        {
          status: 400,
        }
      );
    }

    const {
      name,
      username,
      bio,
      githubUrl,
    } = result.data;

    await connectDB();

    // Check that the username is not already used
    // by another user
    const existingUsername = await User.findOne({
      username,
      _id: {
        $ne: session.user.id,
      },
    });

    if (existingUsername) {
      return Response.json(
        {
          message: "Username is already taken",
        },
        {
          status: 409,
        }
      );
    }

    const user = await User.findById(
      session.user.id
    );

    if (!user) {
      return Response.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const oldUsername = user.username;

user.name = name;
user.username = username;
user.bio = bio;
user.githubUrl = githubUrl;

await user.save();

revalidatePath(`/profile/${oldUsername}`);
revalidatePath(`/profile/${user.username}`);

    return Response.json(
      {
        message: "Profile updated successfully",
        data: {
          id: user._id.toString(),
          name: user.name,
          username: user.username,
          email: user.email,
          image: user.image,
          bio: user.bio,
          githubUrl: user.githubUrl,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Failed to update profile:",
      error
    );

    return Response.json(
      {
        message: "Failed to update profile",
      },
      {
        status: 500,
      }
    );
  }
}