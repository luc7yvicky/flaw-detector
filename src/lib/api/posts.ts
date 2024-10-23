import { VulDBPost, VulDBPostWithChip } from "@/types/post";
import {
  collection,
  doc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  runTransaction,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import db from "../../../firebaseConfig";
import { getUserPinnedPosts } from "./users";

/**
 * 조회수가 높은 상위 게시물 ID를 가져옵니다.
 * @returns Promise<string[]>
 */
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
        chip: "",
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
 * Firestore에서 post의 views를 업데이트합니다.
 */
export async function increasePostViews(postId: string): Promise<void> {
  if (!postId) {
    return;
  }
  try {
    const docRef = doc(db, "posts", postId);
    await updateDoc(docRef, { views: increment(1) });
  } catch (error) {
    console.error("Error updating post views:", error);
    throw new Error("Failed to update post views.");
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
