import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
  startAfter,
  where,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import db from "@/../firebaseConfig";
import { ITEMS_PER_DB_PAGE } from "@/lib/const";

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

async function getPaginatedPosts(
  userId: string,
  searchTerm: string,
  filter: string,
  page: number,
) {
  const postCollection = collection(db, "posts");

  // 1. 조회수 기준 상위 10개 게시글 계산
  const hotPostsSnapshot = await getDocs(
    query(postCollection, orderBy("views", "desc"), limit(10)),
  );
  const hotPostIds = hotPostsSnapshot.docs.map((doc) => doc.id); // 조회수 상위 10개 게시글 ID

  // 2. 사용자 스크랩 정보 가져오기
  const userPinnedPosts = await getUserPinnedPosts(userId);

  // 3. 기본 쿼리 설정
  let baseQuery = query(postCollection, orderBy("created_at", "desc"));

  // 4. 검색어 필터 추가
  if (searchTerm) {
    console.log("Adding search term to query:", searchTerm); // 디버깅
    baseQuery = query(
      postCollection,
      where("keywords", "array-contains-any", searchTerm),
    );
  }

  // 5. 필터 조건 추가
  if (filter === "hot") {
    baseQuery = query(postCollection, orderBy("views", "desc"), limit(10)); // hot 필터
  } else if (filter === "new") {
    const now = Timestamp.now();
    const twoDaysAgo = new Timestamp(
      now.seconds - 48 * 60 * 60,
      now.nanoseconds,
    );
    baseQuery = query(baseQuery, where("created_at", ">", twoDaysAgo)); // new 필터
  }

  // 6. 페이지네이션 처리
  const totalSnapshot = await getDocs(baseQuery);
  const totalDocs = totalSnapshot.docs.length;
  const totalPage = Math.ceil(totalDocs / ITEMS_PER_DB_PAGE);

  if (page > 1 && page <= totalPage) {
    const lastVisibleDoc =
      totalSnapshot.docs[(page - 1) * ITEMS_PER_DB_PAGE - 1];
    baseQuery = query(
      baseQuery,
      startAfter(lastVisibleDoc),
      limit(ITEMS_PER_DB_PAGE),
    );
  } else {
    baseQuery = query(baseQuery, limit(ITEMS_PER_DB_PAGE));
  }

  // 7. Firestore에서 게시글 가져오기
  const snapshot = await getDocs(baseQuery);

  // 8. 각 게시글 데이터에 chip 및 isScrapped 추가
  const now = Timestamp.now();
  const posts = snapshot.docs.map((doc) => {
    const data = doc.data();

    let chip = "";
    if (hotPostIds.includes(doc.id)) {
      chip = "hot"; // 조회수 상위 10개
    } else if (now.seconds - data.created_at.seconds <= 48 * 60 * 60) {
      chip = "new"; // 48시간 이내 생성
    }

    return {
      id: doc.id,
      ...data, // => 필요한 데이터만 추출 예정
      chip, // "hot", "new", or ""
      isScrapped: userPinnedPosts.includes(doc.id),
    };
  });

  return { posts, totalPage };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || ""; // 사용자 ID
    const searchTerm = searchParams.get("searchTerm") || ""; // 검색어
    const filter = searchParams.get("filter") || "all"; // 필터 상태
    const page = parseInt(searchParams.get("page") || "1", 10); // 페이지 번호

    // 페이지네이션 및 데이터 가져오기
    const { posts, totalPage } = await getPaginatedPosts(
      userId,
      searchTerm,
      filter,
      page,
    );

    return NextResponse.json({ posts, totalPage });
  } catch (error) {
    return NextResponse.json(
      { error: "게시글 데이터를 불러오는데 실패했습니다." },
      { status: 500 },
    );
  }
}
