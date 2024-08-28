import type { NextApiRequest, NextApiResponse } from "next";
import { doc, getDoc } from "firebase/firestore";
import db from "../../firebaseConfig";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      // '사용자'는 컬렉션명, 'XcdBxBAoBmZkHEzIsxOy'는 문서 ID를 의미
      const docRef = doc(db, "사용자", "XcdBxBAoBmZkHEzIsxOy");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        res.status(200).json(docSnap.data());
      } else {
        res.status(404).json({ error: "Document not found" });
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      res.status(500).json({ error: "Error fetching document" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
