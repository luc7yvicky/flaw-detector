import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { MemoryOption } from "firebase-functions/v2/options";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { SCHEDULE_EXPRESSION } from "./const";
import { startCertCCWebCrawling } from "./crawling";
import { translatePost } from "./translate";
import { VulDBPost } from "./type";
import { addVulDBPost } from "./firebase";

initializeApp({
  credential: applicationDefault(),
});
export const db = getFirestore();

export const handleScheduledCrawlingCertCC = onSchedule(
  {
    schedule: SCHEDULE_EXPRESSION,
    memory: "1GiB" as MemoryOption,
    timeoutSeconds: 540, // 9분
    secrets: [
      "LLAMA_AUTH_URL",
      "LLAMA_API_URL",
      "LLAMA_USERNAME",
      "LLAMA_PASSWORD",
    ],
  },
  async () => {
    try {
      const posts = await startCertCCWebCrawling();
      const translatedPosts = await translatePost(posts as VulDBPost[]);
      const newPosts = await addPostsToFirestore(
        translatedPosts as VulDBPost[],
      );
      logger.info("새로운 게시글이 추가되었습니다.", newPosts);
    } catch (error) {
      logger.error("에러가 발생했습니다.", error);
    }
  },
);

export const addPostsToFirestore = async (translatedPosts: VulDBPost[]) => {
  if (translatedPosts) {
    translatedPosts.map(async (post: VulDBPost) => {
      return await addVulDBPost(post);
    });
  }
};
