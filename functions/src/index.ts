/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { onSchedule } from "firebase-functions/v2/scheduler";

// Firebase Admin SDK 초기화
initializeApp({
  credential: applicationDefault(),
});
const db = getFirestore();

// 5분마다 실행: "every 5 minutes"
// cron schedule expressions => https://crontab.guru/
const SHEDULE_EXPRESSION = "0 21 * * *"; // 매일 06:00(KST)에 실행: "0 21 * * *" (한국 시간 기준) - 임시 설정

const logDocuments = (snapshot: FirebaseFirestore.QuerySnapshot) => {
  snapshot.forEach((doc) => {
    logger.info(
      `Document in 'posts' collection found: ${doc.id} => ${JSON.stringify(doc.data())}`,
    );
  });
};

export const scheduledTask = onSchedule(SHEDULE_EXPRESSION, async () => {
  try {
    const postsSnapshot = await db.collection("posts").get();

    if (postsSnapshot.empty) {
      logger.info("No documents found in 'posts' collection.");
    } else {
      logDocuments(postsSnapshot);
    }
  } catch (error) {
    logger.error("Error fetching documents from Firestore:", error);
  }
});
