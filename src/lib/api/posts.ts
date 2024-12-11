import { VulDBPinnedInfo } from "@/types/post";
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
} from "firebase/firestore";
import db from "../../../firebaseConfig";
import { BASE_URL } from "../const";

export async function fetchPosts({
  userId,
  filter,
  searchTerm,
  currentPage = 1,
}: {
  userId?: number;
  filter: string;
  searchTerm: string[];
  currentPage: number;
}) {
  const params = new URLSearchParams();
  if (userId) params.append("userId", userId.toString());
  params.append("filter", filter);
  params.append("page", currentPage.toString());
  if (searchTerm.length > 0) {
    params.append("searchTerm", searchTerm.join(","));
  }

  try {
    const response = await fetch(`${BASE_URL}/api/posts?${params.toString()}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts.");
  }
}

export async function fetchPost({
  postId,
  userId,
}: {
  postId: string;
  userId: number;
}) {
  const response = await fetch(
    `${BASE_URL}/api/posts/${postId}?userId=${userId}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch post data");
  }
  return response.json();
}

export async function updatePinnedPost(
  pinnedInfo: VulDBPinnedInfo,
  action: "add" | "remove",
) {
  const response = await fetch(`${BASE_URL}/api/scraps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...pinnedInfo, action }),
  });

  if (!response.ok) {
    throw new Error("스크랩 상태를 변경하는 데 실패했습니다.");
  }
}

/**
 * Firestore에서 post의 views를 업데이트합니다.
 */
export async function increasePostViews(postId: string): Promise<void> {
  try {
    await fetch(`${BASE_URL}/api/posts/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId,
      }),
    });
  } catch (error) {
    console.error("Error updating post views:", error);
    throw new Error("Failed to update post views.");
  }
}

export async function fetchLatestPosts(postId: string, userId: number) {
  const param = new URLSearchParams();
  param.append("userId", userId.toString());
  const res = await fetch(
    `${BASE_URL}/api/posts/latest/${postId}?${param.toString()}`,
  );
  return res.json();
}

/**
 * 검색어 기반으로 실시간 토픽을 업데이트합니다.
 * @param searchTerm
 */
export async function updateRealTimeTopic(searchTerm: string) {
  const searchKeywordRef = doc(db, "searchKeywords", searchTerm);

  try {
    await runTransaction(db, async (transaction) => {
      const searchKeywordDoc = await transaction.get(searchKeywordRef);

      if (searchKeywordDoc.exists()) {
        const newCount = searchKeywordDoc.data().searchCounts + 1;
        transaction.update(searchKeywordRef, { searchCounts: newCount });
      } else {
        transaction.set(searchKeywordRef, { searchCounts: 1 });
      }
    });
  } catch (error) {
    console.error("Error updating RealTime Topic: ", error);
    throw new Error("Failed to update RealTime Topic.");
  }
}
