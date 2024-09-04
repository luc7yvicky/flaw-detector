/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { MemoryOption } from "firebase-functions/v2/options";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { SCHEDULE_EXPRESSION } from "./const";
import { startCertCCWebCrawling } from "./web-crawling/certCC";

initializeApp({
  credential: applicationDefault(),
});
export const db = getFirestore();

// export const handleScheduledPostUpdate = onSchedule(
//   SCHEDULE_EXPRESSION,
//   async () => {
//     await getAndLogDocuments();
//     const addedPost = await addVulDBPost(examplePost);
//     logger.info(`New post added: ${JSON.stringify(addedPost)}`);
//   },
// );

export const handleScheduledCrawlingCertCC = onSchedule(
  {
    schedule: SCHEDULE_EXPRESSION,
    memory: "1GiB" as MemoryOption,
    timeoutSeconds: 540, // 9분
  },
  async () => {
    try {
      logger.info("웹 크롤링 시작합니다."); // 시작 로그
      await startCertCCWebCrawling();
      logger.info("웹 크롤링 끝났습니다."); // 종료 로그
    } catch (error) {
      logger.error("에러가 발생했습니다.", error);
    }
  },
);
