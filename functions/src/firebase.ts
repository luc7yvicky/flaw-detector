import * as logger from "firebase-functions/logger";
import { db } from ".";
import { VulDBPost } from "./type";

const logDocuments = (snapshot: FirebaseFirestore.QuerySnapshot) => {
  snapshot.forEach((doc) => {
    logger.info(
      `Document in 'posts' collection found: ${doc.id} => ${JSON.stringify(doc.data())}`,
    );
  });
};

export const getAndLogDocuments = async (): Promise<void> => {
  try {
    const postsSnapshot = await db.collection("posts").get();

    if (postsSnapshot.empty) {
      logger.info("No documents found in 'posts' collection.");
    } else {
      logDocuments(postsSnapshot);
    }
  } catch (error) {
    logger.error("Error fetching documents from Firestore:", error);
    throw new Error("Failed to retrieve documents");
  }
};

export async function addVulDBPost(post: VulDBPost): Promise<VulDBPost> {
  try {
    const newPostRef = db.collection("posts").doc();

    const newPost = {
      ...post,
      id: newPostRef.id,
    };

    await newPostRef.set(newPost);
    return newPost;
  } catch (error) {
    logger.error("Error adding new post:", error);
    throw new Error("Failed to add new post");
  }
}
