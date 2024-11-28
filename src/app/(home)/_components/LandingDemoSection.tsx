"use client";

import CodeResultsListItem from "@/components/analyze/CodeResultsListItem";
import FileTreeItemDemo from "@/components/analyze/FileTree/FileTreeItemDemo";
import { Status, StatusMessage } from "@/components/analyze/Status";
import Button from "@/components/ui/Button";
import IconList from "@/components/ui/icons/IconList";
import IconMultiSelect from "@/components/ui/icons/IconMultiSelect";
import TitleBar from "@/components/ui/TitleBar";
import { DEMO_CODE_RESULTS, DEMO_FILE_TREE_ITEMS } from "@/lib/dummy";
import Image from "next/image";
import FadeInUpAnimation from "./FadeInUpAnimation";

export default function LandingDemoSection() {
  return (
    <section className="flex-center-center snap-box pointer-events-none relative max-h-screen min-h-[calc(100dvh-8.5rem)] w-full gap-x-[7.29rem] overflow-hidden overflow-y-clip">
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
              <DemoFileList />
            </div>
            <DemoCodeContainer />
          </div>
        </div>
      </section>
      <DemoTextArea />
    </section>
  );
}

function DemoFileList() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-line-light">
      <div className="flex items-center rounded-t-[0.513rem] border-b border-line-light bg-purple-light px-[0.855rem] py-5 text-xl text-black">
        <div className="flex w-full items-center justify-between">
          <span>Files</span>
          <div className="flex gap-3.5">
            <IconMultiSelect width={20} />
            <IconList width={20} />
          </div>
        </div>
      </div>
      <ul className="max-h-[40rem] overflow-x-hidden overflow-y-scroll text-gray-dark scrollbar-hide">
        {DEMO_FILE_TREE_ITEMS.map((item, index) => (
          <FileTreeItemDemo key={index} {...item}>
            {item.name}
          </FileTreeItemDemo>
        ))}
      </ul>
    </div>
  );
}

function DemoCodeContainer() {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative h-full max-h-[23.725rem] w-full overflow-hidden">
        <Image
          src="/images/exampleCode.png"
          alt="example code"
          fill
          sizes="(min-width: 1024px) 100vw, 50vw"
          loading="lazy"
          quality={75}
        />
        <Button
          variant="demo"
          shape="rounded"
          className="top-[35%] translate-x-[25%]"
          aria-label="detected vulnerability"
        >
          🚨 {DEMO_CODE_RESULTS["name"]}
        </Button>
        <Button
          variant="demo"
          shape="rounded"
          className="top-[70%] translate-x-[140%]"
          aria-label="detected vulnerability"
        >
          🚨 Insecure Password Handling
        </Button>
      </div>
      <div className="mt-[1.71rem] flex flex-col gap-y-6">
        <CodeResultsListItem {...DEMO_CODE_RESULTS} />
      </div>
    </div>
  );
}

function DemoTextArea() {
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
