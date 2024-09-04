import { VulDBPost } from "@/types/type";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
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
        updated_at: docSnapshot.data().updated_at || null,
        content: docSnapshot.data().content,
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

    if (newPost.updated_at) {
      postToSave["updated_at"] = newPost.updated_at;
    }

    await setDoc(newPostRef, postToSave);
    return postToSave;
  } catch (error) {
    console.error("Error in savePost:", error);
    throw new Error("Failed to save post.");
  }
}
