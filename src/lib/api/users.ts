import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { User } from "next-auth";
import db from "../../../firebaseConfig";

/**
 * Firestore에 새로운 user를 추가합니다.
 * @returns Promise<void>
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
    const newUserRef = doc(usersCollection);
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
