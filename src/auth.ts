import NextAuth, { UserInfo } from "next-auth";
import { authConfig } from "./auth.config";
import { addUser } from "./lib/api/users";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ account, user, profile }) {
      if (account?.provider === "github") {
        const { id, name, image, email } = user;
        const userId = profile && profile.id ? parseInt(profile.id, 10) : 0;
        const username =
          profile && profile.login ? (profile.login as string) : "";

        const userInfo: UserInfo = {
          id: id || "",
          name: name || "",
          avatar_url: image || "",
          email: email || "",
          userId,
          username,
        };

        user.userId = userId;
        user.username = username;

        try {
          await addUser(userInfo);
        } catch (err) {
          console.error(
            "[Error] error occurs when adding new user in firestore: ",
            err,
          );
        }
        return true;
      }
      return false;
    },
    async jwt({ token, user, account }) {
      if (user) {
        const { userId, username } = user;
        token.userId = userId;
        token.username = username;
      }

      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        const { userId, username, accessToken } = token;
        session.user.userId = userId;
        session.user.username = username;
        session.accessToken = accessToken as string;
      }
      return session;
    },
  },
});
