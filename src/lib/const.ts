export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

export const LLAMA_AUTH_URL = process.env.LLAMA_AUTH_URL;
export const LLAMA_API_URL = process.env.LLAMA_API_URL;
export const LLAMA_USERNAME = process.env.LLAMA_USERNAME;
export const LLAMA_PASSWORD = process.env.LLAMA_PASSWORD;

export const OCTOKIT_TOKEN = process.env.API_GITHUB_TOKEN;

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

export const ITEMS_PER_DB_PAGE = 5;
export const ITEMS_PER_MY_PAGE = 12;
export const PAGES_PER_GROUP = 10;

export const WEB_CRAWLING_SEARCH_KEYWORD = "vulnerability";

export const WEB_CRAWLING_CERT_CC_API_URL = `${BASE_URL}/api/web-crawling/cert-cc`;
export const WEB_CRAWLING_CNNVD_API_URL = `${BASE_URL}/api/web-crawling/cnnvd`;
