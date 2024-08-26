"use client";

import { useTransition } from "react";
import { loginWithGithub } from "@/lib/actions";
import Button from "../ui/Button";
import { IconCaretDoubleDown } from "../ui/Icons";

export default function LandingSection1() {
  const [_, startTransition] = useTransition();

  return (
    <section className="flex-center-center min-h-dvh flex-col items-center bg-[url('/images/landingBg.png')] bg-cover bg-center text-[3.15rem] text-primary-500">
      <h1 className="mb-5">Find your Flaw,</h1>
      <div className="mb-10 rounded-full border-4 border-primary-500 px-10 py-[1.2rem]">
        FlawDetector
      </div>
      <div className="mb-[4rem] text-[1.5rem]">
        인공지능의 뛰어난 분석 능력을 활용하여 코드의 보안 취약점을 신속하게
        해결하세요.
      </div>
      <form action="">
        <Button
          shape="pill"
          className="px-6 py-[0.688rem] text-[1.75rem] font-light leading-[2.118rem] -tracking-[0.01em]"
          onClick={() => startTransition(async () => await loginWithGithub())}
        >
          Login
        </Button>
      </form>
      <IconCaretDoubleDown className="mt-16 animate-bounce" />
    </section>
  );
}
