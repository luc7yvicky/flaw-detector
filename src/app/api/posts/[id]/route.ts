export const revalidate = 3600;

import db from "@/../firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  runTransaction,
  where,
  Timestamp,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

async function getUserPinnedPosts(userId: number) {
  if (!userId) {
    return [];
  }
  const userQuery = query(
    collection(db, "users"),
    where("userId", "==", userId),
  );
  const userSnapshot = await getDocs(userQuery);
  return userSnapshot.empty
    ? []
    : userSnapshot.docs[0].data().pinnedPosts || [];
}

async function getHotPosts(): Promise<string[]> {
  const hotPostsSnapshot = await getDocs(
    query(collection(db, "posts"), orderBy("views", "desc"), limit(10)),
  );
  return hotPostsSnapshot.docs.map((doc) => doc.id);
}

function determineChip(
  postData: any,
  hotPostIds: string[],
  now: Timestamp,
): string {
  if (hotPostIds.includes(postData.id)) return "hot";
  if (now.seconds - postData.created_at.seconds <= 48 * 60 * 60) return "new";
  return "";
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

    const [postSnapshot, userPinnedPosts, hotPostIds, latestPostsSnapshot] =
      await Promise.all([
        getDoc(doc(db, "posts", postId)),
        getUserPinnedPosts(userId),
        getHotPosts(),
        getDocs(
          query(
            collection(db, "posts"),
            orderBy("created_at", "desc"),
            limit(7),
          ),
        ),
      ]);

    if (!postSnapshot.exists()) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const now = Timestamp.now();
    const latestPosts = latestPostsSnapshot.docs
      .filter((doc) => doc.id !== postId)
      .slice(0, 6)
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          created_at: data.created_at,
          source: data.source,
          content: data.content,
          chip: determineChip(data, hotPostIds, now),
          isScrapped: userPinnedPosts.includes(doc.id),
        };
      });

    const post = {
      id: postSnapshot.id,
      ...postSnapshot.data(),
      chip: determineChip(postSnapshot.data(), hotPostIds, now),
      isScrapped: userPinnedPosts.includes(postId),
    };

    return NextResponse.json({ post, latestPosts });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const { postId } = await req.json();
  try {
    const docRef = doc(db, "posts", postId);
    await runTransaction(db, async (transaction) => {
      const postSnapshot = await transaction.get(docRef);
      if (!postSnapshot.exists()) {
        throw new Error("Post does not exist");
      }
      transaction.update(docRef, { views: increment(1) });
    });
    return NextResponse.json({ message: "게시글 조회수를 증가시켰습니다." });
  } catch (error) {
    return NextResponse.json(
      { error: "게시글 조회수를 증가시키는데 실패했습니다." },
      { status: 500 },
    );
  }
}
