"use client";

import Button from "@/components/ui/Button";
import { loginWithGithub } from "@/lib/actions";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";

export default function LoginPage() {
  const [_, startTransition] = useTransition();
  return (
    <>
      <section className="flex-between-center min-h-dvh w-full max-w-[88.938rem]">
        <Image
          src="/images/landingBg.png"
          alt="my repos bg"
          width={1920}
          height={1272}
          priority
          className="absolute left-0 top-0 -z-10"
        />
        <article className="flex-col-center-center text-[3.75rem] leading-[4.538rem] tracking-[0.05em] text-primary-500">
          <span className="mb-5">Find your Flaw,</span>
          <Button
            variant="outlined"
            className="rounded-full border-4 border-primary-500 px-10 py-[1.156rem] font-normal"
            onClick={() => startTransition(async () => await loginWithGithub())}
          >
            Login
          </Button>
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
