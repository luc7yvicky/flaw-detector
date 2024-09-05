import { addPost, getAllPosts } from "@/lib/api/posts";
import { VulDBPost } from "@/types/type";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await getAllPosts();

    return NextResponse.json(
      {
        message: "Posts fetched successfully",
        data: posts,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { message: "Failed to fetch posts." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { post }: { post: VulDBPost } = await request.json();
    const addedPost = await addPost(post);

    return NextResponse.json(
      {
        message: "Post added successfully",
        data: addedPost,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error adding post:", error);
    return NextResponse.json(
      { message: "Failed to add post." },
      { status: 500 },
    );
  }
}
