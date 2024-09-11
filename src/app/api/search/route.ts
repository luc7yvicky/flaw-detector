import { collection, getDocs, or, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";
import db from "../../../../firebaseConfig";

export async function POST(req: Request) {
  const { searchTerm } = await req.json();

  console.log("Search Term:", searchTerm); // 로그로 검색어 확인

  // Firestore에서 데이터를 검색하는 쿼리
  const postsRef = collection(db, "posts");

  try {
    // Firestore 쿼리 설정 (title에 searchTerm 포함)
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

    // 각각의 쿼리 실행
    const [titleSnapshot, contentSnapshot] = await Promise.all([
      getDocs(titleQuery),
      getDocs(contentQuery),
    ]);

    // 중복 제거를 위해 Set 사용
    const postsSet = new Set();

    titleSnapshot.forEach((doc) => postsSet.add(doc.data()));
    contentSnapshot.forEach((doc) => postsSet.add(doc.data()));

    const posts = Array.from(postsSet);

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Firestore에서 데이터를 가져오는 중 오류 발생:", error);
    return NextResponse.json({ posts: [] }, { status: 500 });
  }
}
