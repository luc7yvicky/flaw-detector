import type { NextApiRequest, NextApiResponse } from "next";
import { doc, setDoc } from "firebase/firestore";
import db from "../../firebaseConfig";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { id, data } = req.body; // 클라이언트에서 전송된 데이터

    try {
      // Firestore에 최초 문서 추가 (또는 기존 문서 업데이트)
      const docRef = doc(db, "사용자", id); //"사용자"에 추가하고 싶은 컬렉션 명을 입력
      await setDoc(docRef, data);

      res.status(200).json({ message: "Document successfully written!" });
    } catch (error) {
      console.error("Error writing document: ", error);
      res.status(500).json({ error: "Error writing document" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
