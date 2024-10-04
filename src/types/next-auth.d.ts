import NextAuth from "next-auth";

declare module "next-auth" {
  export type UserInfo = {
    id: string;
    name: string;
    avatar_url: string;
    email: string;
    userId: number;
    username: string;
  };

  interface Session {
    user: UserInfo & DefaultSession["user"];
    accessToken: string;
  }

  interface User extends UserInfo {}
}
