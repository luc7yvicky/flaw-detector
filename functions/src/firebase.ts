import * as logger from "firebase-functions/logger";
import { db } from ".";
import { VulDBPost } from "./type";

export const checkIfCrawlingDataExists = async (pageUrl: string) => {
  try {
    const snapshot = await db
      .collection("posts")
      .where("page_url", "==", pageUrl)
      .get();
    return !snapshot.empty;
  } catch (error) {
    logger.error("Error checking if crawling data exists:", error);
    throw new Error("Failed to check crawling data existence");
  }
};

export async function addVulDBPost(post: VulDBPost): Promise<VulDBPost> {
  try {
    const newPostRef = db.collection("posts").doc();

    const now = Date.now();
    const seconds = Math.floor(now / 1000);
    const nanoseconds = (now % 1000) * 1000000;

    const newPost = {
      ...post,
      id: newPostRef.id,
      created_at: { seconds, nanoseconds },
    };

    await newPostRef.set(newPost);
    return newPost;
  } catch (error) {
    logger.error("Error adding new post:", error);
    throw new Error("Failed to add new post");
  }
}
