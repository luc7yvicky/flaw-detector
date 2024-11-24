"use client";

import Button from "@/components/ui/Button";
import IconCaretDoubleDown from "@/components/ui/icons/IconCaretDoubleDown";
import { loginWithGithub } from "@/lib/actions";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTransition } from "react";

const EllipsesAnimation = dynamic(() => import("./EllipsesAnimation"), {
  ssr: false,
});

export default function LandingHeroSection({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  const [_, startTransition] = useTransition();

  return (
    <section
      className="flex-col-center-center snap-box relative min-h-[calc(100dvh-8.5rem)] text-[3.75rem] leading-[4.538rem] tracking-[0.015em] text-primary-500"
      id="hero"
    >
      <div className="absolute inset-0 -z-10">
        <EllipsesAnimation />
      </div>
      <span className="mb-5">Find your Flaw,</span>
      <h1 className="mb-10 rounded-full border-4 border-primary-500 bg-white px-10 py-[1.156rem]">
        FlawDetector
      </h1>
      <p className="word-break-phrase mb-16 text-center text-[1.5rem]">
        인공지능의 뛰어난 분석 능력을 활용하여 코드의 보안 취약점을 신속하게
        해결하세요.
      </p>
      {isLoggedIn ? (
        <Link href="/repos">
          <Button shape="pill" variant="filled-sm">
            파일 분석하러 가기
          </Button>
        </Link>
      ) : (
        <Button
          shape="pill"
          variant="filled-sm"
          onClick={() => startTransition(async () => await loginWithGithub())}
        >
          Login
        </Button>
      )}
      <IconCaretDoubleDown className="mt-16 animate-bounce" />
    </section>
  );
}
