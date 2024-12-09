import db from "@/../firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

async function getPost(postId: string) {
  const postRef = doc(db, "posts", postId);
  const postSnapshot = await getDoc(postRef);

  if (!postSnapshot.exists()) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  } else {
    return postSnapshot.data();
  }
}

async function checkIsScrapped(userId: number, postId: string) {
  const usersCollection = collection(db, "users");
  const userQuery = query(usersCollection, where("userId", "==", userId));

  const userSnapshot = await getDocs(userQuery);

  const userPinnedPosts = userSnapshot.empty
    ? []
    : userSnapshot.docs[0].data().pinnedPosts || [];

  return userPinnedPosts.includes(postId);
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const postId = params.id;
    const userId = parseInt(req.nextUrl.searchParams.get("userId") || "0", 10);

    if (!postId || !userId) {
      return NextResponse.json(
        { error: "게시물 ID가 유효하지 않습니다." },
        { status: 400 },
      );
    }

    const post = await getPost(postId);
    const isScrapped = await checkIsScrapped(userId, postId);

    return NextResponse.json({ ...post, isScrapped });
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
