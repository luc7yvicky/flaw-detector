import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import db from "@/../firebaseConfig";

async function getUserPinnedPosts(userId: string) {
  if (!userId) {
    return [];
  }

  const usersCollection = collection(db, "users");
  const userIdQuery = query(
    usersCollection,
    where("userId", "==", Number(userId)),
  );

  const userSnapshot = await getDocs(userIdQuery);
  if (userSnapshot.empty) {
    return [];
  }

  const userDoc = userSnapshot.docs[0];
  return userDoc.data()?.pinnedPosts || [];
}

async function getHotPosts() {
  const postCollection = collection(db, "posts");
  const hotPostsSnapshot = await getDocs(
    query(postCollection, orderBy("views", "desc"), limit(10)),
  );
  const hotPostIds = hotPostsSnapshot.docs.map((doc) => doc.id);
  return hotPostIds;
}

async function getLatestPosts(
  userId: string | undefined,
  currentPostId: string,
) {
  const postCollection = collection(db, "posts");
  const userPinnedPosts = userId ? await getUserPinnedPosts(userId) : [];
  const hotPostIds = await getHotPosts();

  const latestPostsQuery = query(
    postCollection,

    orderBy("created_at", "desc"),
    limit(7),
  );

  const querySnapshot = await getDocs(latestPostsQuery);

  if (querySnapshot.empty) {
    return NextResponse.json({ results: [] });
  }

  const filteredPosts = querySnapshot.docs
    .filter((doc) => doc.id !== currentPostId)
    .slice(0, 6);

  const now = Timestamp.now();
  const latestPosts = filteredPosts.map((doc) => {
    const data = doc.data();

    let chip = "";
    if (hotPostIds.includes(doc.id)) {
      chip = "hot";
    } else if (now.seconds - data.created_at.seconds <= 48 * 60 * 60) {
      chip = "new";
    }

    return {
      id: doc.id,
      title: doc.data()["title"],
      created_at: doc.data()["created_at"],
      source: doc.data()["source"],
      content: doc.data()["content"],
      chip,
      isScrapped: userPinnedPosts.includes(doc.id),
    };
  });

  return latestPosts;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "";
    const currentPostId = params.id;

    const latestPosts = await getLatestPosts(userId, currentPostId);

    return NextResponse.json({ results: latestPosts });
  } catch (error) {
    return NextResponse.json(
      { error: "최신 게시글 데이터를 불러오는데 실패했습니다." },
      { status: 500 },
    );
  }
}
