import { ArticleListItem } from "@/types/post";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import db from "../../../../firebaseConfig";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({
      status: 400,
      message: "Bad Request: username is required.",
    });
  }

  try {
    const usersRef = doc(db, "users", username);
    const usersSnap = await getDoc(usersRef);

    if (!usersSnap.exists()) {
      return NextResponse.json({
        status: 404,
        message: "No such User!",
      });
    }

    const userData = usersSnap.data();
    let pinnedPostsIds = [];

    if (userData?.pinnedPosts) {
      pinnedPostsIds = userData.pinnedPosts;
    }

    const postsCollection = collection(db, "posts");
    const pinnedPosts: ArticleListItem[] = [];

    for (const postId of pinnedPostsIds) {
      const q = query(postsCollection, where("id", "==", postId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const post = {
          id: doc.id,
          label: doc.data().label,
          title: doc.data().title.translated,
          createdAt: new Timestamp(
            doc.data().created_at.seconds,
            doc.data().created_at.nanoseconds,
          ).toDate(),
        };

        pinnedPosts.push(post);
      });
    }

    if (pinnedPosts.length === 0) {
      return NextResponse.json({
        status: 404,
        message: "No pinned posts found.",
      });
    }

    return NextResponse.json(pinnedPosts);
  } catch (err) {
    return NextResponse.json({
      status: 400,
      body: "Bad Request: username is required.",
    });
  }
}
