"use client";

import { Status, StatusMessage } from "@/components/analyze/Status";
import Button from "@/components/ui/Button";
import TitleBar from "@/components/ui/TitleBar";
import DemoCodeViewer from "./DemoCodeViewer";
import DemoFileExplorer from "./DemoFileExplorer";
import FadeInUpAnimation from "./FadeInUpAnimation";

export default function LandingDemoSection() {
  return (
    <section className="flex-center-center snap-box pointer-events-none relative max-h-screen min-h-[calc(100dvh-8.5rem)] w-full gap-x-[7.29rem] overflow-hidden overflow-y-clip">
      <DemoPreview />
      <DemoText />
    </section>
  );
}

function DemoPreview() {
  return (
    <section className="mt-[12rem] hidden h-fit w-full max-w-[82.077rem] overflow-hidden overflow-x-visible rounded-[2.634rem] border-[0.102rem] border-line-light p-[3.42rem] lg:block">
      <div className="flex h-[61rem] flex-col">
        <TitleBar title="Project-1" as="span" />
        <div className="flex h-full min-h-dvh gap-7">
          <div className="flex w-full max-w-[16rem] flex-col gap-7">
            <Button
              className="h-[6.75rem] w-full cursor-default text-2xl font-semibold"
              aria-label="detect selected files"
            >
              선택한 파일 검사 (1)
            </Button>
            <Status>
              <StatusMessage type="error">12</StatusMessage>
              <StatusMessage type="warning">8</StatusMessage>
              <StatusMessage type="success">23</StatusMessage>
            </Status>
            <DemoFileExplorer />
          </div>
          <DemoCodeViewer />
        </div>
      </div>
    </section>
  );
}

function DemoText() {
  return (
    <section className="flex-col-center w-fit! gap-y-[2.125rem] leading-tight text-primary-500">
      <FadeInUpAnimation
        as="h3"
        texts={["최신 보안 동향을", "실시간으로 확인하세요."]}
        className="flex-col-end-center w-full space-y-3 truncate text-clamp-3xl font-bold -tracking-[0.011em]"
      />
      <p className="flex-col-end-center w-full space-y-2 text-[1.4rem] font-medium -tracking-[0.011em] text-gray-default sm:text-2xl">
        <span>실시간으로 최신 보안 동향을 제공하여</span>
        <span>개발자들이 보안 취약점에 대한 최신 정보를 받을 수 있어</span>
        <span>보안 강화를 위한 코딩 관행을 지속적으로 개선할 수 있습니다.</span>
      </p>
    </section>
  );
}
