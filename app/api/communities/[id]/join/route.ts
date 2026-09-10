import mongoose from "mongoose";

import { auth } from "@/auth";
import connectDB from "@/lib/db";

import Community from "@/models/Community";
import User from "@/models/User";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// JOIN A COMMUNITY
export async function POST(
  request: Request,
  { params }: RouteContext
) {
  try {
    const session = await auth();

    // User must be signed in
    if (!session?.user?.id) {
      return Response.json(
        { message: "You must be signed in to join a community" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Validate community MongoDB ID
    if (!mongoose.isValidObjectId(id)) {
      return Response.json(
        { message: "Invalid community ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const community = await Community.findById(id);

    if (!community) {
      return Response.json(
        { message: "Community not found" },
        { status: 404 }
      );
    }

    const user = await User.findById(session.user.id);

    if (!user) {
      return Response.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const alreadyMember = community.members.some(
      (memberId: mongoose.Types.ObjectId) =>
        memberId.toString() === session.user.id
    );

    if (alreadyMember) {
      return Response.json(
        { message: "You are already a member of this community" },
        { status: 409 }
      );
    }

    // Add user to the community
    community.members.push(user._id);

    // Add community to the user's joined communities
    user.joinedCommunities.push(community._id);

    await community.save();
    await user.save();

    return Response.json(
      {
        message: "Community joined successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to join community:", error);

    return Response.json(
      { message: "Failed to join community" },
      { status: 500 }
    );
  }
}

// LEAVE A COMMUNITY
export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { message: "You must be signed in to leave a community" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return Response.json(
        { message: "Invalid community ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const community = await Community.findById(id);

    if (!community) {
      return Response.json(
        { message: "Community not found" },
        { status: 404 }
      );
    }

    const user = await User.findById(session.user.id);

    if (!user) {
      return Response.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const isMember = community.members.some(
      (memberId: mongoose.Types.ObjectId) =>
        memberId.toString() === session.user.id
    );

    if (!isMember) {
      return Response.json(
        { message: "You are not a member of this community" },
        { status: 409 }
      );
    }

    // Remove user from community members
    community.members = community.members.filter(
      (memberId: mongoose.Types.ObjectId) =>
        memberId.toString() !== session.user.id
    );

    // Remove community from user's joined communities
    user.joinedCommunities = user.joinedCommunities.filter(
      (communityId: mongoose.Types.ObjectId) =>
        communityId.toString() !== id
    );

    await community.save();
    await user.save();

    return Response.json(
      {
        message: "Community left successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to leave community:", error);

    return Response.json(
      { message: "Failed to leave community" },
      { status: 500 }
    );
  }
}