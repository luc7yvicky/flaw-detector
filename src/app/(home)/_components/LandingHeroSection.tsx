"use client";

import Button from "@/components/ui/Button";
import { IconCaretDoubleDown } from "@/components/ui/Icons";
import { loginWithGithub } from "@/lib/actions";
import Link from "next/link";
import { useTransition } from "react";
import EllipsesAnimation from "./EllipsesAnimation";

export default function LandingHeroSection({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  const [_, startTransition] = useTransition();

  return (
    <section className="flex-center-center relative min-h-[calc(100dvh-8.5rem)] flex-col items-center text-[3.75rem] leading-[4.538rem] tracking-[0.015em] text-primary-500">
    <div className="absolute inset-0 -z-10">
      <EllipsesAnimation />
    </div>
      <span className="mb-5">Find your Flaw,</span>
      <h1 className="mb-10 rounded-full border-4 border-primary-500 bg-white px-10 py-[1.156rem]">
        FlawDetector
      </h1>
      <p className="mb-[4rem] text-[1.5rem]">
        인공지능의 뛰어난 분석 능력을 활용하여 코드의 보안 취약점을 신속하게
        해결하세요.
      </p>
      {isLoggedIn ? (
        <Link prefetch href="/repos">
          <Button
            shape="pill"
            className="flex-center-center px-6 py-[0.688rem] text-center text-[1.75rem] font-light leading-[2.118rem] -tracking-[0.01em]"
          >
            파일 분석하러 가기
          </Button>
        </Link>
      ) : (
        <Button
          shape="pill"
          className="px-6 py-[0.688rem] text-[1.75rem] font-light leading-[2.118rem] -tracking-[0.01em]"
          onClick={() => startTransition(async () => await loginWithGithub())}
        >
          Login
        </Button>
      )}
      <IconCaretDoubleDown className="mt-16 animate-bounce" />
    </section>
  );
}
