import {
  collection,
  getDocs,
  query,
  where,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { NextResponse } from "next/server";
import db from "../../../../firebaseConfig";

export async function POST(req: Request) {
  const { searchTerm } = await req.json();

  console.log("Search Term:", searchTerm); // 검색어 확인용(추후 삭제 예정)

  const postsRef = collection(db, "posts");

  try {
    //Cert-CC
    const descriptionQuery = query(
      postsRef,
      where("content.description.translated.text", ">=", searchTerm),
      where("content.description.translated.text", "<=", searchTerm + "\uf8ff"),
    );

    const solutionQuery = query(
      postsRef,
      where("content.solution.translated.text", ">=", searchTerm),
      where("content.solution.translated.text", "<=", searchTerm + "\uf8ff"),
    );

    const impactQuery = query(
      postsRef,
      where("content.impact.translated.text", ">=", searchTerm),
      where("content.impact.translated.text", "<=", searchTerm + "\uf8ff"),
    );

    const overviewQuery = query(
      postsRef,
      where("content.overview.translated.text", ">=", searchTerm),
      where("content.overview.translated.text", "<=", searchTerm + "\uf8ff"),
    );

    const titleQuery = query(
      postsRef,
      where("content.title.translated", ">=", searchTerm),
      where("content.title.translated", "<=", searchTerm + "\uf8ff"),
    );

    //CNNVD

    const descriptionCNNVDQuery = query(
      postsRef,
      where("content.description.translated", ">=", searchTerm),
      where("content.description.translated", "<=", searchTerm + "\uf8ff"),
    );

    const introductionQuery = query(
      postsRef,
      where("content.introduction.translated.text", ">=", searchTerm),
      where(
        "content.introduction.translated.text",
        "<=",
        searchTerm + "\uf8ff",
      ),
    );

    const remediationQuery = query(
      postsRef,
      where("content.remediation.translated.text", ">=", searchTerm),
      where("content.remediation.translated.text", "<=", searchTerm + "\uf8ff"),
    );

    const vulnDetailQuery = query(
      postsRef,
      where("content.vulnDetail.translated.text", ">=", searchTerm),
      where("content.vulnDetail.translated.text", "<=", searchTerm + "\uf8ff"),
    );

    // 각각의 쿼리 실행 (명시적으로 QuerySnapshot<DocumentData> 타입 지정)
    const [
      descriptionSnapshot,
      descriptionCNNVDQuerySnapshot,
      solutionSnapshot,
      impactSnapshot,
      overviewSnapshot,
      titleSnapshot,
      introductionSnapshot,
      remediationSnapshot,
      vulnDetailSnapshot,
    ] = await Promise.all([
      getDocs(descriptionQuery) as Promise<QuerySnapshot<DocumentData>>,
      getDocs(descriptionCNNVDQuery) as Promise<QuerySnapshot<DocumentData>>,
      getDocs(solutionQuery) as Promise<QuerySnapshot<DocumentData>>,
      getDocs(impactQuery) as Promise<QuerySnapshot<DocumentData>>,
      getDocs(overviewQuery) as Promise<QuerySnapshot<DocumentData>>,
      getDocs(titleQuery) as Promise<QuerySnapshot<DocumentData>>,
      getDocs(introductionQuery) as Promise<QuerySnapshot<DocumentData>>,
      getDocs(remediationQuery) as Promise<QuerySnapshot<DocumentData>>,
      getDocs(vulnDetailQuery) as Promise<QuerySnapshot<DocumentData>>,
    ]);

    // 중복 제거를 위한 Set 사용
    const postsSet = new Set<DocumentData>();

    descriptionSnapshot.forEach((doc) => postsSet.add(doc.data()));
    descriptionCNNVDQuerySnapshot.forEach((doc) => postsSet.add(doc.data()));
    solutionSnapshot.forEach((doc) => postsSet.add(doc.data()));
    impactSnapshot.forEach((doc) => postsSet.add(doc.data()));
    overviewSnapshot.forEach((doc) => postsSet.add(doc.data()));
    titleSnapshot.forEach((doc) => postsSet.add(doc.data()));
    introductionSnapshot.forEach((doc) => postsSet.add(doc.data()));
    remediationSnapshot.forEach((doc) => postsSet.add(doc.data()));
    vulnDetailSnapshot.forEach((doc) => postsSet.add(doc.data()));

    // 중복 제거 후 배열로 변환
    const posts = Array.from(postsSet);

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Firestore에서 데이터를 가져오는 중 오류 발생:", error);
    return NextResponse.json({ posts: [] }, { status: 500 });
  }
}
