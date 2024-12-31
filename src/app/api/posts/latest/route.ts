import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { NextResponse } from "next/server";
import db from "@/../firebaseConfig";

export async function GET() {
  try {
    const postCollection = collection(db, "posts");
    const latestPostsQuery = query(
      postCollection,
      orderBy("created_at", "desc"),
      limit(3),
    );

    const querySnapshot = await getDocs(latestPostsQuery);

    if (querySnapshot.empty) {
      return NextResponse.json({ results: [] });
    }

    const latestPosts: {
      id: string;
      title: { original: string; translated: string };
      created_at: Timestamp;
    }[] = [];

    querySnapshot.forEach((doc) => {
      latestPosts.push({
        id: doc.id,
        title: doc.data()["title"],
        created_at: doc.data()["created_at"],
      });
    });

    return NextResponse.json({ results: latestPosts });
  } catch (error) {
    return NextResponse.json(
      { error: "최신 게시글 데이터를 불러오는데 실패했습니다." },
      { status: 500 },
    );
  }
}
