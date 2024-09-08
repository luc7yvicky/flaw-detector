import {
  collection,
  orderBy,
  limit,
  query,
  onSnapshot,
} from "firebase/firestore";
import db from "../../../firebaseConfig";

export type SearchKeyword = {
  keyword: string;
  searchCounts: number;
};

export function fetchSearchKeywords(
  onKeywordsUpdate: (keywords: SearchKeyword[]) => void,
) {
  const q = query(
    collection(db, "searchKeywords"),
    orderBy("searchCounts", "desc"),
    limit(10),
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    if (querySnapshot.empty) {
      onKeywordsUpdate([]);
      return;
    }

    const topSearchKeywords: SearchKeyword[] = [];

    querySnapshot.forEach((doc) => {
      topSearchKeywords.push({
        keyword: doc.id,
        searchCounts: doc.data()["searchCounts"],
      });
    });

    onKeywordsUpdate(topSearchKeywords);
  });

  return unsubscribe;
}
