import db from "@/../firebaseConfig";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

async function getPost(postId: string) {
  const postRef = doc(db, "posts", postId);
  const postSnapshot = await getDoc(postRef);

  if (postSnapshot.exists()) {
    return postSnapshot.data();
  } else {
    return null;
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const postId = params?.id;
    if (!postId) {
      return NextResponse.json(
        { error: "게시물 ID가 유효하지 않습니다." },
        { status: 400 },
      );
    }

    const post = await getPost(postId);

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: "게시글 데이터를 불러오는데 실패했습니다." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const { postId } = await req.json();

  try {
    const docRef = doc(db, "posts", postId);
    await updateDoc(docRef, { views: increment(1) });
    console.log("게시글 조회수를 증가시켰습니다.");
    return NextResponse.json({ message: "게시글 조회수를 증가시켰습니다." });
  } catch (error) {
    return NextResponse.json(
      { error: "게시글 조회수를 증가시키는데 실패했습니다." },
      { status: 500 },
    );
  }
}
