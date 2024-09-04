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
import { onSchedule } from "firebase-functions/v2/scheduler";
import { SCHEDULE_EXPRESSION } from "./const";
import { examplePost } from "./dummy";
import { addVulDBPost, getAndLogDocuments } from "./firebase";

initializeApp({
  credential: applicationDefault(),
});
export const db = getFirestore();

export const handleScheduledPostUpdate = onSchedule(
  SCHEDULE_EXPRESSION,
  async () => {
    await getAndLogDocuments();
    const addedPost = await addVulDBPost(examplePost);
    logger.info(`New post added: ${JSON.stringify(addedPost)}`);
  },
);
