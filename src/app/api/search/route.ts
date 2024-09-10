import { collection, getDocs, or, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";
import db from "../../../../firebaseConfig";

export async function POST(req: Request) {
  const { searchTerm } = await req.json();

  try {
    const postsRef = collection(db, "posts");

    // title 필드에서 검색
    const titleQuery = query(
      postsRef,
      where("title", ">=", searchTerm),
      where("title", "<=", searchTerm + "\uf8ff"),
    );

    // content 필드에서 검색
    const contentQuery = query(
      postsRef,
      where("content", ">=", searchTerm),
      where("content", "<=", searchTerm + "\uf8ff"),
    );

    // 각각의 쿼리 실행
    const titleSnapshot = await getDocs(titleQuery);
    const contentSnapshot = await getDocs(contentQuery);

    // title과 content에서 검색된 결과를 결합
    const posts = [...titleSnapshot.docs, ...contentSnapshot.docs].map((doc) =>
      doc.data(),
    );

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Firestore에서 데이터를 가져오는 중 오류 발생:", error);
    return NextResponse.json({ posts: [] }, { status: 500 });
  }
}
