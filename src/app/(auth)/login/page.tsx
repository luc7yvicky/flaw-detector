"use client";

import Button from "@/components/ui/Button";
import { loginWithGithub } from "@/lib/actions";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTransition } from "react";

const EllipsesAnimation = dynamic(
  () => {
    return import("@/app/(home)/_components/EllipsesAnimation");
  },
  {
    ssr: false,
  },
);

export default function LoginPage() {
  const [_, startTransition] = useTransition();

  return (
    <main className="flex min-h-[calc(100dvh-8.5rem)] w-full max-w-[88.938rem] flex-col items-center justify-evenly md:flex-row md:justify-between">
      <div className="absolute inset-0 -z-10">
        <EllipsesAnimation />
      </div>

      <h1 className="flex-col-center-center gap-y-5 text-[3.75rem] leading-[4.538rem] tracking-[0.05em] text-primary-500">
        <span>Find your Flaw,</span>
        <Button
          variant="outlined"
          className="rounded-full border-4 px-10 py-[1.156rem] font-normal"
          onClick={() => startTransition(async () => await loginWithGithub())}
        >
          Login
        </Button>
      </h1>
      <div>
        <Button
          shape="pill"
          variant="filled-sm"
          onClick={() => startTransition(async () => await loginWithGithub())}
        >
          Github로 연동 로그인하기
        </Button>
      </div>
      <div>
        <Link href="https://github.com/">
          <Button shape="pill" variant="filled-sm">
            Github
          </Button>
        </Link>
      </div>
    </main>
  );
}
