//데이터 쓰기 테스트 코드
"use client";
import { useState } from "react";

export default function TestPage() {
  const [docData, setDocData] = useState({ name: "", age: "" });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocData({ ...docData, [e.target.name]: e.target.value });
  };

  const onClickSaveDocument = async () => {
    try {
      const response = await fetch("/api/addDocument", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        //id는 문서 id를 의미
        body: JSON.stringify({ id: "새로운_사용자_ID", data: docData }),
      });

      if (response.ok) {
        setMessage("Document successfully written!");
        setDocData({ name: "", age: "" });
      } else {
        setError("Error writing document");
      }
    } catch (err) {
      console.error("Error writing document:", err);
      setError("Error writing document");
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <input
        type="text"
        name="name"
        value={docData.name}
        onChange={onChangeInput}
        placeholder="Name"
        className="mb-2 rounded border border-gray-300 p-2"
      />
      <input
        type="text"
        name="age"
        value={docData.age}
        onChange={onChangeInput}
        placeholder="Age"
        className="mb-4 rounded border border-gray-300 p-2"
      />
      <button
        onClick={onClickSaveDocument}
        className="rounded bg-blue-500 px-4 py-2 font-semibold text-white"
      >
        Save Document
      </button>
      {message && <p className="mt-4 text-green-500">{message}</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
