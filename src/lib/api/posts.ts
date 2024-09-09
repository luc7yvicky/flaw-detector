import { VulDBPost } from "@/types/post";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
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
 * Firestore에 새로운 post를 추가합니다.
 * @returns Promise<VulDBPost>
 */
export async function addPost(newPost: VulDBPost): Promise<VulDBPost> {
  try {
    const postsCollection = collection(db, "posts");
    const newPostRef = doc(postsCollection);

    const postToSave = {
      ...newPost,
      id: newPostRef.id, // 새로운 post의 id를 자동 생성합니다.
    };

    if (newPost.source_updated_at) {
      postToSave["source_updated_at"] = newPost.source_updated_at;
    }

    await setDoc(newPostRef, postToSave);
    return postToSave;
  } catch (error) {
    console.error("Error in savePost:", error);
    throw new Error("Failed to save post.");
  }
}

//삭제
export async function deleteCNNVDPosts() {
  const postsRef = collection(db, "posts");
  const q = query(postsRef, where("source", "==", "CNNVD"));

  try {
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No documents found with source 'CNNVD'.");
      return;
    }

    const batchDeletions: any[] = [];

    querySnapshot.forEach((docSnapshot) => {
      const docRef = doc(db, "posts", docSnapshot.id);
      batchDeletions.push(deleteDoc(docRef));
    });

    await Promise.all(batchDeletions);
    console.log("source가 'CNNVD'인 모든 문서 삭제됨 ");
  } catch (error) {
    console.error("Error deleting documents: ", error);
    throw new Error("게시물 삭제 실패");
  }
}
