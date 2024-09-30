export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

export const LLAMA_AUTH_URL = process.env.LLAMA_AUTH_URL;
export const LLAMA_API_URL = process.env.LLAMA_API_URL;
export const LLAMA_USERNAME = process.env.LLAMA_USERNAME;
export const LLAMA_PASSWORD = process.env.LLAMA_PASSWORD;

export const OCTOKIT_TOKEN = process.env.OCTOKIT_TOKEN;

export const GITHUB_ID = process.env.AUTH_GITHUB_ID;
export const GITHUB_SECRET = process.env.AUTH_GITHUB_SECRET;

export const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
export const FIREBASE_AUTH_DOMAIN =
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
export const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
export const FIREBASE_STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
export const FIREBASE_MESSAGING_SENDER_ID =
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
export const FIREBASE_APP_ID = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
export const FIREBASE_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

export const NODEMAILER_HOST = process.env.NODEMAILER_HOST;
export const NODEMAILER_PORT = process.env.NODEMAILER_PORT;
export const NODEMAILER_SENDER = process.env.NODEMAILER_SENDER;
export const NODEMAILER_AUTH_USER = process.env.NODEMAILER_AUTH_USER;
export const NODEMAILER_AUTH_PASS = process.env.NODEMAILER_AUTH_PASS;

export const ITEMS_PER_DB_PAGE = 5;
export const ITEMS_PER_MY_PAGE = 12;
export const PAGES_PER_GROUP = 10;

export const NAME_VALIDATION_MESSAGE =
  "이름은 공백 없이 2자 이상이어야 합니다.";
export const EMAIL_VALIDATION_MESSAGE = "이메일 형식이 유효하지 않습니다.";
export const MESSAGE_VALIDATION_MESSAGE = "메세지는 5자 이상이어야 합니다.";
export const SERVER_ERROR_MESSAGE =
  "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";

export const WEB_CRAWLING_SEARCH_KEYWORD = "vulnerability";

export const WEB_CRAWLING_CERT_CC_API_URL = `${BASE_URL}/api/web-crawling/cert-cc`;
export const WEB_CRAWLING_CNNVD_API_URL = `${BASE_URL}/api/web-crawling/cnnvd`;

export const FILE_INSPECTION_STATUS_KEY = "fileStatuses";
