import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import db from "../../../../firebaseConfig";

export async function POST(req: NextRequest) {
  const { username, repos } = await req.json();

  try {
    const reposCollection = collection(db, "repos");
    const q = query(reposCollection, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return NextResponse.json({
        status: 200,
        body: "Repository already exists in Firestore.",
      });
    }

    await addDoc(reposCollection, {
      username,
      repos,
    });

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

    if (!favorite) {
      // 북마크 여부 저장
      repoData.repos[repoIndex].favorite = favorite;
    }

    if (!clickedAt) {
      // 클릭한 시간 저장
      repoData.repos[repoIndex].clickedAt = clickedAt;
    }

    if (!detectedStatus) {
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
  const favorite = searchParams.get("favorite") === "true";
  const clickedAt = searchParams.get("clickedAt") === "true";

  if (!username) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
  }

  try {
    const reposCollection = collection(db, "repos");
    const q = query(reposCollection, where("username", "==", username));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return NextResponse.json({ repos: [] });
    }

    let repos = querySnapshot.docs[0].data().repos;

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

    return NextResponse.json({ repos });
  } catch (err) {
    console.error("Error fetching document:", err);
    return NextResponse.json({
      status: 500,
      body: "Failed to fetch document",
    });
  }
}
