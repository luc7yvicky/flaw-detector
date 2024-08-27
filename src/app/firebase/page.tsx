"use client";
import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import db from "../../../firebaseConfig";

export default function TestPage() {
  const [docData, setDocData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const onClickFetchDocument = async () => {
    try {
      const docRef = doc(db, "사용자", "XcdBxBAoBmZkHEzIsxOy");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setDocData(docSnap.data());
        console.log("Document data:", docSnap.data());
      } else {
        console.log("No such document!");
        setDocData(null);
      }
    } catch (err) {
      console.error("Error fetching document: ", err);
      setError("Error fetching document");
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <button
        onClick={onClickFetchDocument}
        className="rounded bg-blue-500 px-4 py-2 font-semibold text-white"
      >
        Fetch Document
      </button>
      {docData && (
        <div className="mt-4 rounded border border-gray-300 p-4">
          <h3 className="text-lg font-bold">Document Data:</h3>
          <pre>{JSON.stringify(docData, null, 2)}</pre>
        </div>
      )}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
