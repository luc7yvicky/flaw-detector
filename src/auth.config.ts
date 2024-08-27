import type { NextAuthConfig } from "next-auth";
import Github from "next-auth/providers/github";
import { GITHUB_ID, GITHUB_SECRET } from "./lib/const";

export const authConfig = {
  session: {
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async redirect({ baseUrl }) {
      if (baseUrl.endsWith("/")) {
        baseUrl = baseUrl.slice(0, -1);
      }
      return `${baseUrl}/my/repos`;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAnalyze = nextUrl.pathname.startsWith("/analyze");

      if (isOnAnalyze) {
        return isLoggedIn;
      }

      return true;
    },
  },
  providers: [
    Github({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
    }),
  ],
} satisfies NextAuthConfig;
