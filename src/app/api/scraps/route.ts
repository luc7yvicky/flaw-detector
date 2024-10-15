import { ITEMS_PER_MY_PAGE } from "@/lib/const";
import { ITEMS_PER_MY_PAGE } from "@/lib/const";
import { ArticleListItem } from "@/types/post";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  limit,
  query,
  startAfter,
  startAfter,
  Timestamp,
  where,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import db from "../../../../firebaseConfig";

/**
 * 사용자가 스크랩한 게시물의 아이디로 (1)페이징하거나 (2)필터링한 게시물을 가져옵니다.
 *
 * @param pinnedPostsIds
 * @param label
 * @param page
 * @returns
 */
async function getFilteredArticles(
  pinnedPostsIds: string[],
  label: string,
  page: number,
) {
  const postsCollection = collection(db, "posts");
  let q = query(postsCollection, where("id", "in", pinnedPostsIds));

  // 필터링
  if (label) {
    q = query(q, where("label", "==", label));
  }

  // 페이징
  const totalDocsSnapshot = await getDocs(q);
  if (totalDocsSnapshot.empty) {
    return { filteredArticles: [], totalPage: 0 };
  }

  totalDocsSnapshot.docs.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
  });

  const totalDocs = totalDocsSnapshot.docs.length;
  const totalPage = Math.ceil(totalDocs / ITEMS_PER_MY_PAGE);

  if (page > 1) {
    const lastVisibleDoc =
      totalDocsSnapshot.docs[(page - 1) * ITEMS_PER_MY_PAGE - 1];
    q = query(q, startAfter(lastVisibleDoc), limit(ITEMS_PER_MY_PAGE));
  } else {
    q = query(q, limit(ITEMS_PER_MY_PAGE));
  }

  const postsSnapshot = await getDocs(q);

  if (postsSnapshot.empty) {
    throw new Error("조건에 맞는 게시물이 없습니다.");
  }

  const filteredArticles: ArticleListItem[] = postsSnapshot.docs.map((doc) => ({
    id: doc.id,
    label: doc.data().label,
    title: doc.data().title.translated || doc.data().title.original,
    createdAt: new Timestamp(
      doc.data().created_at.seconds,
      doc.data().created_at.nanoseconds,
    ).toDate(),
  }));

  return { filteredArticles, totalPage };
}

/**
 * 스크랩한 게시물을 가져옵니다.
 *
 * @param req
 * @returns
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  console.log(searchParams);
  const username = searchParams.get("username");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const page = parseInt(searchParams.get("page") || "1", 10);

  if (!username) {
    return NextResponse.json({
      status: 400,
      message: "사용자 정보를 가져오는 데 실패했습니다.",
    });
  }

  try {
    const usersRef = doc(db, "users", username);
    const usersSnap = await getDoc(usersRef);

    if (!usersSnap.exists()) {
      return NextResponse.json({
        status: 404,
        message: "사용자가 존재하지 않습니다.",
        message: "사용자가 존재하지 않습니다.",
      });
    }

    const userData = usersSnap.data();

    if (userData?.pinnedPosts) {
      pinnedPostsIds = userData.pinnedPosts;
    }

    const postsCollection = collection(db, "posts");
    const pinnedPosts: ArticleListItem[] = [];

    for (const postId of pinnedPostsIds) {
      let q = query(postsCollection, where("id", "==", postId));
      let q = query(postsCollection, where("id", "==", postId));
      const querySnapshot = await getDocs(q);

      // 페이지네이션
      const totalDocs = querySnapshot.docs.length;
      const totalPage = Math.ceil(totalDocs / ITEMS_PER_MY_PAGE);

      if (page > totalPage) {
        return NextResponse.json({
          status: 404,
          message: "잘못된 요청입니다.",
        });
      }

      if (page > 1) {
        const lastDoc = querySnapshot.docs[(page - 1) * ITEMS_PER_MY_PAGE - 1];
        q = query(q, startAfter(lastDoc), limit(ITEMS_PER_MY_PAGE));
      } else {
        q = query(q, limit(ITEMS_PER_MY_PAGE));
      }

      const paginatedSnapshot = await getDocs(q);

      if (paginatedSnapshot.empty) {
        return NextResponse.json({
          status: 404,
          message: "스크랩한 게시물이 없습니다.",
        });
      }

      paginatedSnapshot.forEach((doc) => {

      // 페이지네이션
      const totalDocs = querySnapshot.docs.length;
      const totalPage = Math.ceil(totalDocs / ITEMS_PER_MY_PAGE);

      if (page > totalPage) {
        return NextResponse.json({
          status: 404,
          message: "잘못된 요청입니다.",
        });
      }

      if (page > 1) {
        const lastDoc = querySnapshot.docs[(page - 1) * ITEMS_PER_MY_PAGE - 1];
        q = query(q, startAfter(lastDoc), limit(ITEMS_PER_MY_PAGE));
      } else {
        q = query(q, limit(ITEMS_PER_MY_PAGE));
      }

      const paginatedSnapshot = await getDocs(q);

      if (paginatedSnapshot.empty) {
        return NextResponse.json({
          status: 404,
          message: "스크랩한 게시물이 없습니다.",
        });
      }

      paginatedSnapshot.forEach((doc) => {
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

    return NextResponse.json({
      posts: filteredArticles,
      totalPage: totalPage,
    });
  } catch (err) {
    console.error(`Internal Server Error: ${err}`);
    return NextResponse.json({
      status: 500,
      message:
        "Internal Server Error: An error occurred while fetching pinned posts.",
    });
  }
}
