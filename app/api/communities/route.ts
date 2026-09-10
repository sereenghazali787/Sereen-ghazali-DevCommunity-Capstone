import connectDB from "@/lib/db";
import Community from "@/models/Community";

export async function GET() {
  try {
    await connectDB();

    const communities = await Community.find()
      .populate("creator", "name username image")
      .sort({ createdAt: -1 });

    return Response.json(
      {
        data: communities,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch communities:", error);

    return Response.json(
      {
        message: "Failed to fetch communities",
      },
      { status: 500 }
    );
  }
}