import type { NextAuthConfig } from "next-auth";
import github from "next-auth/providers/github";
import { GITHUB_ID, GITHUB_SECRET } from "./lib/const";

export const authConfig = {
  session: {
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAnalyze = nextUrl.pathname.startsWith("/analyze");

      if (isOnAnalyze) {
        if (isLoggedIn) return true;
        return false;
      }

      return true;
    },
  },
  providers: [
    github({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
    }),
  ],
} satisfies NextAuthConfig;
