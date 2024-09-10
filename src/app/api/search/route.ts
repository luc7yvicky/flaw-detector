import { collection, getDocs, or, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";
import db from "../../../../firebaseConfig";

export async function POST(req: Request) {
  const { searchTerm } = await req.json();

  // Firestore에서 데이터를 검색하는 쿼리
  const postsRef = collection(db, "posts");

  try {
    // Firestore 쿼리 설정 (title 또는 content에 searchTerm 포함)
    const q = query(
      postsRef,
      or(
        where("title", ">=", searchTerm),
        where("title", "<=", searchTerm + "\uf8ff"),
        where("content", ">=", searchTerm),
        where("content", "<=", searchTerm + "\uf8ff"),
      ),
    );

    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map((doc) => doc.data());

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Firestore에서 데이터를 가져오는 중 오류 발생:", error);
    return NextResponse.json({ posts: [] }, { status: 500 });
  }
}
