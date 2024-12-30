import { VulDBPinnedInfo } from "@/types/post";
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

export async function fetchPostAndSimilarPosts({
  postId,
  userId,
}: {
  postId: string;
  userId: number;
}) {
  const params = new URLSearchParams();
  if (userId) params.append("userId", userId.toString());

  try {
    const response = await fetch(
      `${BASE_URL}/api/posts/${postId}?${params.toString()}`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching post and similar posts:", error);
    throw new Error("Failed to fetch post and similar posts.");
  }
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

export async function increasePostViews(postId: string): Promise<void> {
  if (!postId) {
    console.error("postId is required to increase views.");
    return;
  }

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
