import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const redirectIfLoggedIn = async (redirectTo: string) => {
  const session = await auth();

  // 로그인한 사용자
  if (session) {
    redirect(redirectTo);
  }
};

export const redirectIfNotLoggedIn = async (redirectTo: string) => {
  const session = await auth();

  // 로그인 하지 않은 사용자
  if (!session) {
    redirect(redirectTo);
  }
};
