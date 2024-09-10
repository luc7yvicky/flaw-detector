import { deleteCNNVDPosts } from "@/lib/api/posts";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    await deleteCNNVDPosts();
    return NextResponse.json({
      success: true,
      message: "Posts deleted successfully",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ success: false, error: errorMessage });
  }
}
