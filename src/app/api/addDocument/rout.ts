import { doc, setDoc } from "firebase/firestore";
import db from "../../../../firebaseConfig";
import { NextRequest, NextResponse } from "next/server";

export default async function POST(req: NextRequest) {
  try {
    const { id, data } = await req.json();

    // Firestore에 최초 문서 추가 (또는 기존 문서 업데이트)
    const docRef = doc(db, "test", id); //"사용자"에 추가하고 싶은 컬렉션 명을 입력
    await setDoc(docRef, data);

    return NextResponse.json({ message: "Document successfully written!" });
  } catch (error) {
    console.error("Error writing document: ", error);
    return NextResponse.json(
      { error: "Error writing document" },
      { status: 500 },
    );
  }
}
