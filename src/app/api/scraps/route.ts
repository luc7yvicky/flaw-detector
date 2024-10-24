import { ITEMS_PER_MY_PAGE } from "@/lib/const";
import { ArticleListItem } from "@/types/post";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  startAfter,
  Timestamp,
  where,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import db from "../../../../firebaseConfig";

/**
 * 필터링하거나 페이징한 게시물을 가져옵니다.
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

  const totalDocs = totalDocsSnapshot.docs.length;
  const totalPage = Math.ceil(totalDocs / ITEMS_PER_MY_PAGE);

  if (page > 1 && page <= totalPage) {
    const lastVisibleDoc =
      totalDocsSnapshot.docs[(page - 1) * ITEMS_PER_MY_PAGE - 1];
    q = query(q, startAfter(lastVisibleDoc), limit(ITEMS_PER_MY_PAGE));
  } else {
    q = query(q, limit(ITEMS_PER_MY_PAGE));
  }

  const postsSnapshot = await getDocs(q);

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
  const username = searchParams.get("username");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const label = searchParams.get("label") || "";

  if (!username) {
    return NextResponse.json(
      {
        situation: "사용자 정보를 가져오는 데 실패했습니다.",
        solution: "로그인 후 다시 시도해주세요.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const usersRef = doc(db, "users", username);
    const usersSnap = await getDoc(usersRef);

    if (!usersSnap.exists()) {
      return NextResponse.json(
        {
          situation: "사용자가 존재하지 않습니다.",
          solution: "회원가입을 진행해주세요.",
        },
        {
          status: 404,
        },
      );
    }

    const userData = usersSnap.data();

    if (!userData.pinnedPosts || userData.pinnedPosts.length === 0) {
      return NextResponse.json(
        {
          situation: "스크랩한 게시물이 없습니다.",
          solution:
            "취약점 DB 페이지에서 관심 있는 취약점 기사를 스크랩해보세요!",
        },
        {
          status: 404,
        },
      );
    }

    const pinnedPostsIds: string[] = userData.pinnedPosts;
    const { filteredArticles, totalPage } = await getFilteredArticles(
      pinnedPostsIds,
      label,
      page,
    );

    return NextResponse.json(
      {
        posts: filteredArticles,
        totalPage: totalPage,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error(`Internal Server Error: ${err}`);
    return NextResponse.json(
      {
        situation: "게시물을 불러오는 중에 오류가 발생했습니다.",
        solution: "잠시 후 다시 시도해주세요.",
      },
      { status: 500 },
    );
  }
}
