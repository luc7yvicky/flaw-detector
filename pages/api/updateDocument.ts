import type { NextApiRequest, NextApiResponse } from "next";
import { doc, updateDoc } from "firebase/firestore";
import db from "../../firebaseConfig";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const docRef = doc(db, "사용자", "XcdBxBAoBmZkHEzIsxOy");

    try {
      await updateDoc(docRef, {
        capital: true,
      });
      res.status(200).json({ message: "document successfully updated!" });
    } catch (error) {
      console.error("Error updating document :", error);
      res.status(500).json({ error: "Error updating document" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
