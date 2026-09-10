import connectDB from "@/lib/db";

export async function GET() {
  try {
    await connectDB();

    return Response.json(
      { message: "MongoDB connected successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database connection error:", error);

    return Response.json(
      { message: "MongoDB connection failed" },
      { status: 500 }
    );
  }
}