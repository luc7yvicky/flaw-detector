import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import db from "../../../../../firebaseConfig";

export async function POST(req: NextRequest) {
  const { username, repo, filePath, results } = await req.json();

  try {
    const resultsCollection = collection(db, "results");
    const usernameAndFilepathQuery = query(
      resultsCollection,
      where("username", "==", username),
      where("filePath", "==", filePath),
    );

    const querySnapshot = await getDocs(usernameAndFilepathQuery);
    if (!querySnapshot.empty) {
      return NextResponse.json(
        { error: "Result already exists in Firestore." },
        { status: 200 },
      );
    }

    await addDoc(resultsCollection, {
      id: uuidv4(),
      username,
      repo,
      filePath,
      results,
      createdAt: new Date().toUTCString(),
    });

    return NextResponse.json({ message: "Results added to Firestore." });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save results." },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  const repo = searchParams.get("repo");
  const filePath = searchParams.get("filePath");

  if (!username) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
  }

  try {
    const resultsCollection = collection(db, "results");
    let resultsQuery;

    if (filePath) {
      resultsQuery = query(
        resultsCollection,
        where("username", "==", username),
        where("filePath", "==", filePath),
      );
    } else if (repo) {
      resultsQuery = query(
        resultsCollection,
        where("username", "==", username),
        where("repo", "==", repo),
      );
    } else {
      return NextResponse.json(
        { error: "Missing filePath or repo." },
        { status: 400 },
      );
    }

    const querySnapshot = await getDocs(resultsQuery);
    if (querySnapshot.empty) {
      return NextResponse.json({ results: null });
    }

    let results;
    if (repo) {
      results = querySnapshot.docs.map((doc) => doc.data().filePath);
    } else {
      results = querySnapshot.docs[0].data().results;
    }

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch results." },
      { status: 500 },
    );
  }
}
