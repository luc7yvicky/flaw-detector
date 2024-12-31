import { VulDBPinnedInfo } from "@/types/post";
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { User } from "next-auth";
import db from "../../../firebaseConfig";
import { BASE_URL, FILE_INSPECTION_STATUS_KEY } from "../const";

/**
 * Firestore에 새로운 user를 추가합니다.
 * @returns {Promise<void>}
 */
export async function addUser(newUser: User): Promise<void> {
  if (!db) {
    console.error("Firestore is not initialized.");
    return;
  }

  try {
    const usersCollection = collection(db, "users");
    const emailQuery = query(
      usersCollection,
      where("email", "==", newUser.email),
    );

    const querySnapshot = await getDocs(emailQuery);
    if (!querySnapshot.empty) {
      console.log("[Alert] User already exists in Firestore.");
      return;
    }

    // 최초로 로그인한 유저의 document 생성
    const newUserRef = doc(usersCollection, newUser.username);
    const userToSave = {
      ...newUser,
      id: newUserRef.id,
    };

    await setDoc(newUserRef, userToSave);
    console.log("User added to Firestore.");
  } catch (err) {
    console.error(
      "[Error] error occurs when adding user document in users collection: ",
      err,
    );
    throw new Error("Failed to save user.");
  }
}

/**
 * Firestore에 저장되어 있는 user 정보를 모두 삭제합니다.
 * @returns {Promise<void>}
 */
export async function deleteUserData(username: string): Promise<void> {
  if (!username) {
    throw new Error("Username이 필요합니다.");
  }

  try {
    // 1. users collection 데이터 삭제
    const usersCollection = collection(db, "users");
    const usersQuery = query(
      usersCollection,
      where("username", "==", username),
    );
    const usersSnapshot = await getDocs(usersQuery);
    usersSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    // 2. results collection 데이터 삭제
    const resultsCollection = collection(db, "results");
    const resultsQuery = query(
      resultsCollection,
      where("username", "==", username),
    );
    const resultsSnapshot = await getDocs(resultsQuery);
    resultsSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    // 3. repos collection 데이터 삭제
    const reposCollection = collection(db, "repos");
    const reposQuery = query(reposCollection, where("owner", "==", username));
    const reposSnapshot = await getDocs(reposQuery);
    reposSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    // 4. 로컬 스토리지 안의 데이터 삭제
    if (typeof window !== "undefined") {
      localStorage.removeItem(FILE_INSPECTION_STATUS_KEY);
    }

    console.log(`유저 ${username}의 모든 정보를 삭제했습니다.`);
  } catch (error) {
    console.error("유저 정보를 삭제하는 중 오류 발생:", error);
    throw new Error("유저 정보를 삭제하는 중 오류가 발생했습니다.");
  }
}

/**
 * 사용자가 스크랩한 게시물을 가져옵니다.
 *
 * @param username
 * @param currPage
 * @param labelType
 * @returns
 */
export async function fetchArticleList(
  username: string,
  currPage: number = 1,
  labelType: string = "",
) {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("page", currPage.toString());
  params.append("label", labelType);

  try {
    const res = await fetch(`${BASE_URL}/api/scraps?${params.toString()}`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    return { ...data, status: res.status };
  } catch (err) {
    console.error("Error fetching article list:", err);
    return { error: "게시물을 불러오는 데 실패했습니다.", status: 500 };
  }
}
