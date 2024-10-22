import { ITEMS_PER_MY_PAGE } from "@/lib/const";
import { RepoListData } from "@/types/repo";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import db from "../../../../firebaseConfig";

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
      newRepos.set(`${username}_${repo.repositoryName}`, repo);
    });

    // 변경 사항 비교
    if (
      newRepos.size === prevRepos.size &&
      Array.from(prevRepos.keys()).every((key) => newRepos.has(key))
    ) {
      return NextResponse.json(
        {
          body: "Repository already exists in Firestore.",
        },
        {
          status: 200,
        },
      );
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

  if (!username || !repoName) {
    return NextResponse.json(
      { error: "Missing username or repoName" },
      { status: 400 },
    );
  }

  try {
    const docId = `${username}_${repoName}`;
    const repoDocRef = doc(db, "repos", docId);
    const repoDoc = await getDoc(repoDocRef);

    if (!repoDoc.exists()) {
      return NextResponse.json(
        {
          error: "Repository not found in Firestore.",
        },
        {
          status: 404,
        },
      );
    }

    const updates: Partial<RepoListData & { clickedAt: string }> = {};

    // 북마크 여부 저장
    if (favorite !== undefined) {
      updates.favorite = favorite;
    }

    // 클릭한 시간 저장
    if (clickedAt) {
      updates.clickedAt = clickedAt;
    }

    // 검사 상태 저장
    if (detectedStatus) {
      updates.detectedStatus = detectedStatus;
    }

    await updateDoc(repoDocRef, updates);

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
  const filterType = searchParams.get("filterType");
  const favorite = searchParams.get("favorite") === "true";
  const clickedAt = searchParams.get("clickedAt") === "true";

  if (!username) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
  }

  try {
    const reposCollection = collection(db, "repos");
    let q = query(reposCollection, where("owner", "==", username));

    if (filterType) {
      q = query(q, where("detectedStatus", "==", filterType));
    }

    if (favorite) {
      q = query(q, where("favorite", "==", true));
    }

    // 복합 쿼리 생성 시, 등호 연산자와 부등호 연산자를 결합하기 위해 firestore에 복합 색인 생성
    if (clickedAt) {
      q = query(
        q,
        where("clickedAt", "!=", null),
        orderBy("clickedAt", "desc"),
      );
    }

    const querySnapshot = await getDocs(q);

    // 페이지네이션
    const totalDocs = querySnapshot.docs.length;
    const totalPage = Math.ceil(totalDocs / ITEMS_PER_MY_PAGE);

    if (page > 1 && page <= totalPage) {
      const lastDoc = querySnapshot.docs[(page - 1) * ITEMS_PER_MY_PAGE - 1];
      q = query(q, startAfter(lastDoc), limit(ITEMS_PER_MY_PAGE));
    } else {
      q = query(q, limit(ITEMS_PER_MY_PAGE));
    }

    const paginatedSnapshot = await getDocs(q);
    if (paginatedSnapshot.empty) {
      return NextResponse.json({ repos: [], totalPage }, { status: 200 });
    }

    const repos = paginatedSnapshot.docs.map((doc) => doc.data());

    return NextResponse.json({ repos, totalPage }, { status: 200 });
  } catch (err) {
    console.error("Error fetching document:", err);
    return NextResponse.json(
      {
        body: "Failed to fetch document",
      },
      {
        status: 500,
      },
    );
  }
}
