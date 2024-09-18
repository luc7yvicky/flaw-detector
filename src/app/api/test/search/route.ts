// import db from "@/lib/firebaseAdmin";
// import { NextRequest, NextResponse } from "next/server";

// // // POST 요청 처리 (검색)
// // export async function POST(req: NextRequest) {
// //   const { searchTerm } = await req.json();

// //   if (!searchTerm) {
// //     return NextResponse.json(
// //       { error: "검색어를 입력해주세요." },
// //       { status: 400 },
// //     );
// //   }

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const query = searchParams.get("query")?.toLocaleLowerCase().trim();

//   if (!query) {
//     return NextResponse.json(
//       { error: "검색어를 입력해주세요." },
//       { status: 400 },
//     );
//   }

//   try {
//     // 검색할 필드 (여기서는 title의 translated 필드를 검색)
//     const field = "title.translated";

//     // Firestore에서 검색어와 일치하는 데이터를 가져오는 쿼리
//     const querySnapshot = await db
//       .collection("posts")
//       .where(field, ">=", query)
//       .where(field, "<=", query + "\uf8ff")
//       .limit(10) // 검색 결과를 10개로 제한 (필요 시 조정 가능)
//       .get();

//     // 쿼리 결과가 없는 경우 처리
//     if (querySnapshot.empty) {
//       return NextResponse.json({ posts: [] });
//     }

//     // 검색 결과에서 데이터 추출
//     const posts = querySnapshot.docs.map((doc: any) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     // 검색된 결과를 JSON 형식으로 반환
//     return NextResponse.json({ posts });
//   } catch (error) {
//     console.error("Firestore 검색 중 오류 발생:", error);
//     return NextResponse.json(
//       { error: "데이터를 가져오는 중 오류가 발생했습니다." },
//       { status: 500 },
//     );
//   }
// }
// // import {
// //   collection,
// //   getDocs,
// //   query,
// //   where,
// //   QuerySnapshot,
// //   DocumentData,
// // } from "firebase/firestore";
// // import { NextRequest, NextResponse } from "next/server";
// // import db from "../../../../firebaseConfig";

// // export async function POST(req: NextRequest) {
// //   const { searchTerm } = await req.json();

// //   console.log("Search Term:", searchTerm); // 검색어 확인용(추후 삭제 예정)

// //   const postsRef = collection(db, "posts");

// //   const titleQuery = query(
// //     postsRef,
// //     where("content.title.translated", ">=", searchTerm),
// //     where("content.title.translated", "<=", searchTerm + "\uf8ff"),
// //   );

// //   const querySnapshot = await getDocs(titleQuery);
// //   const posts = querySnapshot.docs.map((doc) => doc.data());

// //   return NextResponse.json({ posts });

// //   // try {
// //   //   //Cert-CC
// //   //   const descriptionQuery = query(
// //   //     postsRef,
// //   //     where("content.description.translated.text", ">=", searchTerm),
// //   //     where("content.description.translated.text", "<=", searchTerm + "\uf8ff"),
// //   //   );

// //   //   const solutionQuery = query(
// //   //     postsRef,
// //   //     where("content.solution.translated.text", ">=", searchTerm),
// //   //     where("content.solution.translated.text", "<=", searchTerm + "\uf8ff"),
// //   //   );

// //   //   const impactQuery = query(
// //   //     postsRef,
// //   //     where("content.impact.translated.text", ">=", searchTerm),
// //   //     where("content.impact.translated.text", "<=", searchTerm + "\uf8ff"),
// //   //   );

// //   //   const overviewQuery = query(
// //   //     postsRef,
// //   //     where("content.overview.translated.text", ">=", searchTerm),
// //   //     where("content.overview.translated.text", "<=", searchTerm + "\uf8ff"),
// //   //   );

// //   //   const titleQuery = query(
// //   //     postsRef,
// //   //     where("content.title.translated", ">=", searchTerm),
// //   //     where("content.title.translated", "<=", searchTerm + "\uf8ff"),
// //   //   );

// //   //   //CNNVD

// //   //   const descriptionCNNVDQuery = query(
// //   //     postsRef,
// //   //     where("content.description.translated", ">=", searchTerm),
// //   //     where("content.description.translated", "<=", searchTerm + "\uf8ff"),
// //   //   );

// //   //   const introductionQuery = query(
// //   //     postsRef,
// //   //     where("content.introduction.translated.text", ">=", searchTerm),
// //   //     where(
// //   //       "content.introduction.translated.text",
// //   //       "<=",
// //   //       searchTerm + "\uf8ff",
// //   //     ),
// //   //   );

// //   //   const remediationQuery = query(
// //   //     postsRef,
// //   //     where("content.remediation.translated.text", ">=", searchTerm),
// //   //     where("content.remediation.translated.text", "<=", searchTerm + "\uf8ff"),
// //   //   );

// //   //   const vulnDetailQuery = query(
// //   //     postsRef,
// //   //     where("content.vulnDetail.translated.text", ">=", searchTerm),
// //   //     where("content.vulnDetail.translated.text", "<=", searchTerm + "\uf8ff"),
// //   //   );

// //   //   // 각각의 쿼리 실행 (명시적으로 QuerySnapshot<DocumentData> 타입 지정)
// //   //   const [
// //   //     descriptionSnapshot,
// //   //     descriptionCNNVDQuerySnapshot,
// //   //     solutionSnapshot,
// //   //     impactSnapshot,
// //   //     overviewSnapshot,
// //   //     titleSnapshot,
// //   //     introductionSnapshot,
// //   //     remediationSnapshot,
// //   //     vulnDetailSnapshot,
// //   //   ] = await Promise.all([
// //   //     getDocs(descriptionQuery) as Promise<QuerySnapshot<DocumentData>>,
// //   //     getDocs(descriptionCNNVDQuery) as Promise<QuerySnapshot<DocumentData>>,
// //   //     getDocs(solutionQuery) as Promise<QuerySnapshot<DocumentData>>,
// //   //     getDocs(impactQuery) as Promise<QuerySnapshot<DocumentData>>,
// //   //     getDocs(overviewQuery) as Promise<QuerySnapshot<DocumentData>>,
// //   //     getDocs(titleQuery) as Promise<QuerySnapshot<DocumentData>>,
// //   //     getDocs(introductionQuery) as Promise<QuerySnapshot<DocumentData>>,
// //   //     getDocs(remediationQuery) as Promise<QuerySnapshot<DocumentData>>,
// //   //     getDocs(vulnDetailQuery) as Promise<QuerySnapshot<DocumentData>>,
// //   //   ]);

// //   //   // 중복 제거를 위한 Set 사용
// //   //   const postsSet = new Set<DocumentData>();

// //   //   descriptionSnapshot.forEach((doc) => postsSet.add(doc.data()));
// //   //   descriptionCNNVDQuerySnapshot.forEach((doc) => postsSet.add(doc.data()));
// //   //   solutionSnapshot.forEach((doc) => postsSet.add(doc.data()));
// //   //   impactSnapshot.forEach((doc) => postsSet.add(doc.data()));
// //   //   overviewSnapshot.forEach((doc) => postsSet.add(doc.data()));
// //   //   titleSnapshot.forEach((doc) => postsSet.add(doc.data()));
// //   //   introductionSnapshot.forEach((doc) => postsSet.add(doc.data()));
// //   //   remediationSnapshot.forEach((doc) => postsSet.add(doc.data()));
// //   //   vulnDetailSnapshot.forEach((doc) => postsSet.add(doc.data()));

// //   //   // 중복 제거 후 배열로 변환
// //   //   const posts = Array.from(postsSet);

// //   //   return NextResponse.json({ posts });
// //   // } catch (error) {
// //   //   console.error("Firestore에서 데이터를 가져오는 중 오류 발생:", error);
// //   //   return NextResponse.json({ posts: [] }, { status: 500 });
// //   // }
// // }

import db from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

// Firestore에서 검색하는 함수
async function searchPosts(query: string) {
  try {
    const field = "title.translated";

    const querySnapshot = await db
      .collection("posts")
      .where(field, ">=", query)
      .where(field, "<=", query + "\uf8ff")
      .limit(10)
      .get();

    if (querySnapshot.empty) {
      return NextResponse.json({ posts: [] });
    }

    const posts = querySnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Firestore 검색 중 오류 발생:", error);
    return NextResponse.json(
      { error: "데이터를 가져오는 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

// POST 요청 처리
export async function POST(req: NextRequest) {
  const { searchTerm } = await req.json();

  if (!searchTerm) {
    return NextResponse.json(
      { error: "검색어를 입력해주세요." },
      { status: 400 },
    );
  }

  return searchPosts(searchTerm);
}

// GET 요청 처리
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query")?.toLocaleLowerCase().trim();

  if (!query) {
    return NextResponse.json(
      { error: "검색어를 입력해주세요." },
      { status: 400 },
    );
  }

  return searchPosts(query);
}
