import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { NextResponse } from "next/server";
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
