"use client";

import Button from "@/components/ui/Button";
import { loginWithGithub } from "@/lib/actions";
import Link from "next/link";
import { useTransition } from "react";

export default function LoginPage() {
  const [_, startTransition] = useTransition();
  return (
    <>
      <div className="bg-[url('/images/landingBg.png')] bg-cover bg-center" />
      <section className="flex-between-center min-h-dvh w-full max-w-[88.938rem]">
        <article className="flex-col-center-center text-[3.15rem] text-primary-500">
          <span className="mb-5">Find your Flaw,</span>
          <h1 className="mb-10 rounded-full border-4 border-primary-500 px-10 py-[1.2rem]">
            FlawDetector
          </h1>
        </article>
        <article>
          <Button
            shape="pill"
            className="px-6 py-[0.688rem] text-[1.75rem] font-light leading-[2.118rem] -tracking-[0.01em]"
            onClick={() => startTransition(async () => await loginWithGithub())}
          >
            Github로 연동 로그인하기
          </Button>
        </article>
        <article>
          <Link href="https://github.com/">
            <Button
              shape="pill"
              className="px-6 py-[0.688rem] text-[1.75rem] font-light leading-[2.118rem] -tracking-[0.01em]"
            >
              Github
            </Button>
          </Link>
        </article>
      </section>
    </>
  );
}
