// import admin from "firebase-admin";
// import { FIREBASE_PROJECT_ID } from "./const";

// // Firebase Admin SDK 초기화 (서버 전용)
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.applicationDefault(), // 또는 serviceAccountKey 사용 가능
//     projectId: FIREBASE_PROJECT_ID,
//     // databaseURL: "https://flawdetector-dae61.firebaseio.com", // 실시간 데이터베이스가 필요한 경우
//   });
// }

// const db = admin.firestore();

// export default db;

import admin from "firebase-admin";
import { GOOGLE_APPLICATION_CREDENTIALS } from "./const";
import * as fs from "fs";

// 파일 경로에서 JSON 파일을 읽어오는 함수
const serviceAccount = GOOGLE_APPLICATION_CREDENTIALS
  ? JSON.parse(fs.readFileSync(GOOGLE_APPLICATION_CREDENTIALS, "utf8"))
  : null;

if (!admin.apps.length && serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

const db = admin.firestore();
export default db;
