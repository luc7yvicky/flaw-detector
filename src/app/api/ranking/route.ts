import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
} from "firebase/firestore";
import { NextResponse, NextRequest } from "next/server";
import db from "../../../../firebaseConfig";

export async function GET() {
  try {
    const q = query(
      collection(db, "searchKeywords"),
      orderBy("searchCounts", "desc"),
      limit(10),
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ results: null });
    }

    const topSearchKeywords: {
      keyword: string;
      searchCounts: number;
    }[] = [];

    querySnapshot.forEach((doc) => {
      topSearchKeywords.push({
        keyword: doc.id,
        searchCounts: doc.data()["searchCounts"],
      });
    });

    return NextResponse.json({ results: topSearchKeywords });
  } catch (error) {
    return NextResponse.json(
      { error: "검색어 데이터를 불러오는데 실패했습니다." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchTerm } = await req.json();

    if (!searchTerm || typeof searchTerm !== "string") {
      return NextResponse.json(
        { error: "유효하지 않은 검색어입니다." },
        { status: 400 },
      );
    }

    const searchKeywordRef = doc(db, "searchKeywords", searchTerm);

    await runTransaction(db, async (transaction) => {
      const searchKeywordDoc = await transaction.get(searchKeywordRef);

      if (searchKeywordDoc.exists()) {
        const newCount = searchKeywordDoc.data().searchCounts + 1;
        transaction.update(searchKeywordRef, { searchCounts: newCount });
      } else {
        transaction.set(searchKeywordRef, { searchCounts: 1 });
      }
    });

    return NextResponse.json({
      message: "검색어가 성공적으로 추가되었습니다.",
    });
  } catch (error) {
    console.error("Error updating RealTime Topic:", error);
    return NextResponse.json(
      { error: "Failed to update RealTime Topic." },
      { status: 500 },
    );
  }
}
