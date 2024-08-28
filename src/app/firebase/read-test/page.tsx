// 데이터 읽기 테스트 코드
"use client";
import { useState } from "react";

export default function TestPage() {
  const [docData, setDocData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const onClickFetchDocument = async () => {
    try {
      const response = await fetch("/api/getDocument");
      if (response.ok) {
        const data = await response.json();
        setDocData(data);
      } else {
        setError("Document not found or error occurred");
      }
    } catch (err) {
      console.error("Error fetching document:", err);
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
