"use server";

import { signIn } from "@/auth";

export async function githubLogin() {
  await signIn("github");
}
