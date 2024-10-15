import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import db from "../../../../firebaseConfig";
import { RepoListData } from "@/types/repo";
import { ITEMS_PER_MY_PAGE } from "@/lib/const";

export async function POST(req: NextRequest) {
  const { username, repos }: { username: string; repos: RepoListData[] } =
    await req.json();

  try {
    const reposCollection = collection(db, "repos");
    const batch = writeBatch(db);

    const q = query(reposCollection, where("owner", "==", username));
    const querySnapshot = await getDocs(q);

    // 기존 레포지토리 목록 생성
    const prevRepos = new Map<string, RepoListData>();
    querySnapshot.forEach((doc) => {
      prevRepos.set(doc.id, doc.data() as RepoListData);
    });

    // 전달 받은 레포지토리 목록 생성
    const newRepos = new Map<string, RepoListData>();
    repos.forEach((repo) => {
      newRepos.set(`${username}_${repo.id}`, repo);
    });

    // 변경 사항 비교
    if (
      newRepos.size === prevRepos.size &&
      Array.from(prevRepos.keys()).every((key) => newRepos.has(key))
    ) {
      return NextResponse.json({
        status: 200,
        body: "Repository already exists in Firestore.",
      });
    }

    const reposToDelete: string[] = [];
    const reposToAdd: { id: string; repo: RepoListData }[] = [];

    prevRepos.forEach((_, id) => {
      if (!newRepos.has(id)) {
        reposToDelete.push(id);
      }
    });

    newRepos.forEach((repo, id) => {
      if (!prevRepos.has(id)) {
        reposToAdd.push({ id, repo });
      }
    });

    // 배치 배열에서 레포지토리 삭제
    reposToDelete.forEach((id) => {
      const docRef = doc(reposCollection, id);
      batch.delete(docRef);
    });

    // 배치 배열에 레포지토리 추가
    reposToAdd.forEach(({ id, repo }) => {
      const docRef = doc(reposCollection, id);
      batch.set(docRef, {
        owner: username,
        ...repo,
      });
    });

    await batch.commit();

    return NextResponse.json({ message: "Repository added to Firestore." });
  } catch (err) {
    console.error("Error adding Repository document:", err);
    return NextResponse.json(
      { message: "Failed to add Repository document." },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  const { username, repoName, favorite, clickedAt, detectedStatus } =
    await req.json();

  try {
    const reposCollection = collection(db, "repos");
    const q = query(reposCollection, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({
        status: 404,
        body: "Repository not found in Firestore.",
      });
    }

    const repoDoc = querySnapshot.docs[0];
    const repoData = repoDoc.data();
    const repoIndex = repoData.repos.findIndex(
      (repo: any) => repo.repositoryName === repoName,
    );

    if (repoIndex === -1) {
      return NextResponse.json({
        status: 404,
        body: "Repository not found in Firestore.",
      });
    }

    if (favorite) {
      // 북마크 여부 저장
      repoData.repos[repoIndex].favorite = favorite;
    }

    if (clickedAt) {
      // 클릭한 시간 저장
      repoData.repos[repoIndex].clickedAt = clickedAt;
    }

    if (detectedStatus) {
      // 검사 상태 저장
      repoData.repos[repoIndex].detectedStatus = detectedStatus;
    }

    await updateDoc(repoDoc.ref, {
      repos: repoData.repos,
    });

    return NextResponse.json({ message: "Repository updated in Firestore." });
  } catch (err) {
    console.error("Error updating document:", err);
    return NextResponse.json({
      status: 500,
      body: "Failed to update document",
    });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const favorite = searchParams.get("favorite") === "true";
  const clickedAt = searchParams.get("clickedAt") === "true";

  if (!username) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
  }

  try {
    const reposCollection = collection(db, "repos");
    let q = query(reposCollection, where("owner", "==", username));
    const querySnapshot = await getDocs(q);

    // 페이지네이션
    const totalDocs = querySnapshot.docs.length;
    const totalPage = Math.ceil(totalDocs / ITEMS_PER_MY_PAGE);

    // 전달 받은 페이지가 마지막 페이지 수보다 클 경우의 예외 처리
    if (page > totalPage) {
      return NextResponse.json({ repos: [], totalPage });
    }

    if (page > 1) {
      const lastDoc = querySnapshot.docs[(page - 1) * ITEMS_PER_MY_PAGE - 1];
      q = query(q, startAfter(lastDoc), limit(ITEMS_PER_MY_PAGE));
    } else {
      q = query(q, limit(ITEMS_PER_MY_PAGE));
    }

    const paginatedSnapshot = await getDocs(q);
    if (paginatedSnapshot.empty) {
      return NextResponse.json({ repos: [], totalPage });
    }

    let repos = paginatedSnapshot.docs.map((doc) => doc.data());

    if (favorite) {
      repos = repos.filter((repo: any) => repo.favorite);
    }

    if (clickedAt) {
      repos = repos.filter((repo: any) => repo.clickedAt);
      repos.sort(
        (a: any, b: any) =>
          new Date(b.clickedAt).getTime() - new Date(a.clickedAt).getTime(),
      );
    }

    return NextResponse.json({ repos, totalPage });
  } catch (err) {
    console.error("Error fetching document:", err);
    return NextResponse.json({
      status: 500,
      body: "Failed to fetch document",
    });
  }
}
