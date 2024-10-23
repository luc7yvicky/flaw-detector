import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import extractPostTitleKeywords from "./utils.mjs";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function checkIfCrawlingDataExists(pageUrl) {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("page_url", "==", pageUrl));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size > 0) {
      // console.log("존재하는 크롤링 데이터입니다.");
      return true;
    } else {
      // console.log("새로운 크롤링 데이터입니다.");
      return false;
    }
  } catch (error) {
    console.error("Error checking if crawling data exists:", error);
    throw new Error("Failed to check crawling data existence");
  }
}

export async function addVulDBPost(post) {
  try {
    const newPostRef = doc(collection(db, "posts"));

    const title = post.title.translated || post.title.original;
    const keywords = extractPostTitleKeywords(title);

    const newPost = {
      ...post,
      id: newPostRef.id,
      created_at: Timestamp.now(),
      keywords,
    };

    await setDoc(newPostRef, newPost);
    return newPost;
  } catch (error) {
    console.error("Error adding new post:", error);
    throw new Error("Failed to add new post");
  }
}
