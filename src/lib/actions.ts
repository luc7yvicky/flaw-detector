"use server";

import { auth, signIn, signOut } from "@/auth";

/**
 * 깃허브 연동 로그인
 */
export const loginWithGithub = async () => {
  await signIn("github");
};

/**
 * 로그아웃
 */
export const logout = async () => {
  await signOut();
};

/**
 * 세션 정보 가져오기
 */
export const getSession = async () => {
  return await auth();
};
