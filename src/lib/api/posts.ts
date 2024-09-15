import { VulDBPost } from "@/types/post";
import {
  collection,
  doc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import db from "../../../firebaseConfig";

/**
 * Firestore에서 모든 post를 가져옵니다.
 * @returns Promise<VulDBPost[]>
 */
export async function getAllPosts(): Promise<VulDBPost[]> {
  try {
    const postsCollection = collection(db, "posts");
    const postsSnapshot = await getDocs(postsCollection);

    if (postsSnapshot.empty) {
      return [];
    }

    const posts: VulDBPost[] = [];
    postsSnapshot.forEach((docSnapshot) => {
      // console.log(docSnapshot.id, " => ", docSnapshot.data());

      const post = {
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
      };

      posts.push(post);
    });

    return posts;
  } catch (error) {
    console.error("Error in getAllPosts:", error);
    throw new Error("Failed to get all posts.");
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
 * Firestore에서 post의 created_at을 기준으로 정렬된 최신 posts를 가져옵니다.
 */
export async function getLatestPosts(
  currentPostId: string,
  maxLimit: number = 6,
): Promise<VulDBPost[]> {
  try {
    const q = query(
      collection(db, "posts"),
      orderBy("created_at", "desc"),
      limit(maxLimit + 1), // 중복되는 경우의 수를 고려하여 7개를 가져옴
    );

    const querySnapshot = await getDocs(q);

    const posts: VulDBPost[] = [];
    querySnapshot.forEach((doc) => {
      const post = {
        id: doc.id,
        label: doc.data().label,
        source: doc.data().source,
        page_url: doc.data().page_url,
        title: doc.data().title,
        created_at: doc.data().created_at,
        source_updated_at: doc.data().source_updated_at || null,
        source_created_at: doc.data().source_created_at,
        content: doc.data().content,
        views: doc.data().views,
      };

      if (post.id !== currentPostId) {
        posts.push(post);
      }
    });

    return posts;
  } catch (error) {
    console.error("Error in getLatestPosts:", error);
    throw new Error("Failed to get latest posts.");
  }
}
