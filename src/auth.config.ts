import type { NextAuthConfig } from "next-auth";
import Github from "next-auth/providers/github";
import { GITHUB_ID, GITHUB_SECRET } from "./lib/const";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.endsWith("/me")) {
        return baseUrl;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnRepos = nextUrl.pathname.startsWith("/repos");

      if (isOnRepos) {
        return isLoggedIn;
      }

      return true;
    },
  },
  providers: [
    Github({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
      authorization: {
        params: { scope: "repo" },
      },
    }),
  ],
} satisfies NextAuthConfig;
