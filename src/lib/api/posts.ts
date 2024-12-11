import { VulDBPinnedInfo, VulDBPost, VulDBPostWithChip } from "@/types/post";
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  startAfter,
  where,
} from "firebase/firestore";
import db from "../../../firebaseConfig";
import { BASE_URL } from "../const";
import { getUserPinnedPosts } from "./users";

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

// /**
//  * 조회수가 높은 상위 게시물 ID를 가져옵니다.
//  * @returns Promise<string[]>
//  */
export async function getTopHotPostIds(): Promise<string[]> {
  const postsCollection = collection(db, "posts");
  const hotPostsQuery = query(
    postsCollection,
    orderBy("views", "desc"),
    limit(10),
  );

  const snapshot = await getDocs(hotPostsQuery);
  const hotPostIds: string[] = [];

  snapshot.forEach((docSnapshot) => {
    hotPostIds.push(docSnapshot.id);
  });

  return hotPostIds;
}

/**
 * Firestore에서 페이지 단위로 post를 가져옵니다.
 * @returns Promise<VulDBPost[]>
 */
export async function getPaginatedPosts(
  pageSize: number,
  lastVisiblePost: VulDBPost | null = null,
  userId: number | null = null,
  searchTerm: string[] | null = null,
): Promise<{ posts: VulDBPost[]; lastVisiblePost: VulDBPost | null }> {
  try {
    const postsCollection = collection(db, "posts");
    let postsQuery;

    if (lastVisiblePost) {
      postsQuery = query(
        postsCollection,
        orderBy("created_at", "desc"),
        startAfter(lastVisiblePost.created_at),
        limit(pageSize),
      );
    } else {
      postsQuery = query(
        postsCollection,
        orderBy("created_at", "desc"),
        limit(pageSize),
      );
    }

    if (searchTerm && searchTerm.length > 0) {
      postsQuery = query(
        postsCollection,
        where("keywords", "array-contains-any", searchTerm),
        limit(pageSize),
      );
    }

    const postsSnapshot = await getDocs(postsQuery);
    if (postsSnapshot.empty) {
      return { posts: [], lastVisiblePost: null };
    }

    let userPinnedPosts: string[] = [];
    if (userId) {
      userPinnedPosts = await getUserPinnedPosts(userId);
    }

    const posts: VulDBPostWithChip[] = [];
    let lastPost: VulDBPostWithChip | null = null;

    postsSnapshot.forEach((docSnapshot) => {
      const post: VulDBPostWithChip = {
        id: docSnapshot.id,
        label: docSnapshot.data().label,
        source: docSnapshot.data().source,
        page_url: docSnapshot.data().page_url,
        title: docSnapshot.data().title,
        created_at: docSnapshot.data().created_at,
        source_updated_at: docSnapshot.data().source_updated_at || null,
        source_created_at: docSnapshot.data().source_created_at,
        content: docSnapshot.data().content,
        views: docSnapshot.data().views,
        chip: "all",
        isScrapped: userPinnedPosts.includes(docSnapshot.id),
      };
      posts.push(post);
      lastPost = post;
    });

    return { posts, lastVisiblePost: lastPost };
  } catch (error) {
    console.error("Error fetching paginated posts:", error);
    throw new Error("Failed to get paginated posts.");
  }
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

/**
 * 모든 post 문서의 title 필드를 기반으로 keywords 필드를 업데이트합니다.
 */
// export async function updateTitleKeywordsForPosts() {
//   try {
//     const postsCollection = collection(db, "posts");
//     const postsQuery = query(postsCollection);
//     const postsSnapshot = await getDocs(postsQuery);

//     postsSnapshot.forEach(async (docSnapshot) => {
//       const postData = docSnapshot.data();

//       if (postData.keywords) {
//         console.log(
//           `Document ${docSnapshot.id} already has keywords. Skipping update.`,
//         );
//         return;
//       }

//       const title = postData.title.translated || postData.title.original;
//       const keywords = extractPostTitleKeywords(title);

//       await updateDoc(docSnapshot.ref, { keywords: keywords });

//       console.log(
//         `Updated document ${docSnapshot.id} with keywords:`,
//         keywords,
//       );
//     });
//   } catch (error) {
//     console.error("Error updating title keywords for posts: ", error);
//     throw new Error("Failed to update title keywords for posts.");
//   }
// }
