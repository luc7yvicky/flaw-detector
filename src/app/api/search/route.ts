import { collection, getDocs, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";
import db from "../../../../firebaseConfig";

export async function POST(req: Request) {
  const { searchTerm } = await req.json();

  console.log("Search Term:", searchTerm); // 검색어 확인을 위한 로그

  const postsRef = collection(db, "posts");

  try {
    // title과 content 각각에 대해 쿼리 설정
    const titleQuery = query(
      postsRef,
      where("title", ">=", searchTerm),
      where("title", "<=", searchTerm + "\uf8ff"),
    );

    const contentQuery = query(
      postsRef,
      where("content", ">=", searchTerm),
      where("content", "<=", searchTerm + "\uf8ff"),
    );

    // 쿼리 실행
    const [titleSnapshot, contentSnapshot] = await Promise.all([
      getDocs(titleQuery),
      getDocs(contentQuery),
    ]);

    // 중복 제거를 위한 Set 사용
    const postsSet = new Set();

    titleSnapshot.forEach((doc) => postsSet.add(doc.data()));
    contentSnapshot.forEach((doc) => postsSet.add(doc.data()));

    // 중복 제거 후 배열로 변환
    const posts = Array.from(postsSet);

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Firestore에서 데이터를 가져오는 중 오류 발생:", error);
    return NextResponse.json({ posts: [] }, { status: 500 });
  }
}
