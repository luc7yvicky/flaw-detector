"use client";

import dynamic from "next/dynamic";
import FadeInUpAnimation from "./FadeInUpAnimation";

const IconBug = dynamic(() => import("@/components/ui/icons/IconBug"));
const SquareBackground = dynamic(() => import("./SquareBackground"));

export default function LandingFeatureSection() {
  return (
    <section className="flex-end-center snap-box relative max-h-screen min-h-[calc(100dvh-8.5rem)] w-full overflow-hidden bg-primary-50 text-primary-500">
      <div className="mx-auto flex w-full max-w-screen-xl items-center p-12 lg:justify-between xl:p-4">
        <article className="lg:max-w-dvw h-auto w-auto leading-tight lg:max-w-[55%]">
          <FadeInUpAnimation
            texts={["쉽고 편하게", "취약점을 발견하다"]}
            className="flex-col-start-center w-full space-y-3 whitespace-nowrap text-clamp-4xl font-bold tracking-[-0.01em]"
          />
          <p className="mt-[3.75rem] flex flex-col space-y-3 text-clamp-md font-bold tracking-[-0.01em] text-gray-dark">
            <span>코드보안</span>
            <span>어떻게 관리하시나요?</span>
          </p>
          <p className="flex-col-start-center mb-2 mt-7 space-y-2 text-clamp-sm tracking-[-0.01em] text-gray-default">
            <span>플로디텍터는 안전한 소프트웨어 개발을 위한 필수 도구로,</span>
            <span>코드의 보안 취약점을 사전에 수정함으로써</span>
            <span>개발자들에게 편의와 안전한 개발 환경을 제공합니다.</span>
          </p>
        </article>
        <article className="hidden lg:block">
          <div className="relative z-10 overflow-hidden rounded-lg bg-white p-[3vw] shadow-[0_2.6vw_2.6vw_-1vw_rgba(97,0,255,0.25)] md:flex">
            <IconBug width="7.5vw" height="7.65vw" />
          </div>
          <SquareBackground className="absolute -right-[22%] bottom-[18%] overflow-hidden xl:-bottom-[12%]" />
        </article>
      </div>
    </section>
  );
}
