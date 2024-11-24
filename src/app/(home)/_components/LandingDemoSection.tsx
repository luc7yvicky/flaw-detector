"use client";

import CodeResultsListItem from "@/components/analyze/CodeResultsListItem";
import FileTreeItemDemo, {
  FileTreeItemDemoProps,
} from "@/components/analyze/FileTree/FileTreeItemDemo";
import { Status, StatusMessage } from "@/components/analyze/Status";
import Button from "@/components/ui/Button";
import IconList from "@/components/ui/icons/IconList";
import IconMultiSelect from "@/components/ui/icons/IconMultiSelect";
import TitleBar from "@/components/ui/TitleBar";
import { FileResultProps } from "@/types/file";
import Image from "next/image";
import FadeInUpAnimation from "./FadeInUpAnimation";

const demoFileTreeItems: Array<FileTreeItemDemoProps> = [
  { type: "dir", name: "public" },
  { type: "dir", name: "src", isOpenDir: true },
  { type: "dir", name: "app", isOpenDir: true, level: 1 },
  { type: "dir", name: "(blog)", isOpenDir: true, level: 2 },
  {
    type: "file",
    name: "layout.tsx",
    level: 3,
    isChecked: true,
  },
  { type: "file", name: "page.tsx", level: 3, isBookmarked: true },
  { type: "dir", name: "api", level: 2 },
  { type: "file", name: "globals.css", level: 3, isHovered: true },
  { type: "file", name: "layout.tsx", level: 3, isSuccessful: true },
  { type: "file", name: "loading.tsx", level: 3 },
];

const demoCodeResults: Array<FileResultProps> = [
  {
    id: "1",
    name: "XSS (Cross-Site Scripting) Vulnerability",
    vulnerability:
      "사용자 입력을 HTML에 직접 삽입하면서 HTML을 안전하게 처리하지 않음.",
    severity: "High",
    descriptions: [
      "사용자 입력을 HTML에 삽입하기 전에 반드시 적절한 인코딩을 수행하거나, DOM API를 사용해 안전하게 요소를 삽입해야함.",
      "‘innerHTML’은 입력된 HTML 코드를 그대로 렌더링하기 때문에 악성 스크립트를 실행할 수 있음. ‘textContent’는 HTML을 해석하지 않고 텍스트로만 처리하기 때문에 안전함.",
    ],
    lines: "12-13",
    modified_codes: [
      "function displayUserInput(input) {",
      "  document.getElementById('userInput').textContent = input;",
      "}",
    ],
  },
  {
    id: "2",
    name: "Insecure Password Handling",
    vulnerability: "비밀번호를 ‘localStorage’ 에 평문으로 저장함.",
    severity: "High",
    descriptions: [
      "비밀번호는 브라우저의 메모리에서만 유지되도록 하고, 저장이 필요한 경우에는 안전한 해시 알고리즘을 사용해 해시값만 저장.",
      "‘localStorage’는 자바스크립트를 통해 쉽게 접근할 수 있어, 악성 스크립트에 의해 유출될 수 있음. 비밀번호를 해시하여 저장하면 공격자가 해시값을 얻더라도 원래 비밀번호를 알아내기 어려움.",
    ],
    lines: "30-40",
    modified_codes: [
      "const query = `SELECT * FROM users WHERE id = ${sanitizedId}`;",
      "db.query(query);",
    ],
  },
];

export default function LandingDemoSection() {
  return (
    <section className="flex-center-center snap-box pointer-events-none relative max-h-screen min-h-[calc(100dvh-8.5rem)] w-full gap-x-[7.29rem] overflow-hidden overflow-y-clip">
      <section className="mt-[12rem] hidden h-fit w-full max-w-[82.077rem] overflow-hidden overflow-x-visible rounded-[2.634rem] border-[0.102rem] border-line-light p-[3.42rem] lg:block">
        <div className="flex h-[61rem] flex-col">
          <TitleBar title="Project-1" as="span" />
          <div className="flex h-full min-h-dvh gap-7">
            <article className="flex w-full max-w-[16rem] flex-col gap-7">
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

              {/* FileList */}
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
                  {demoFileTreeItems.map((item, index) => (
                    <FileTreeItemDemo key={index} {...item}>
                      {item.name}
                    </FileTreeItemDemo>
                  ))}
                </ul>
              </div>
            </article>

            {/* CodeContainer */}
            <article className="relative w-full overflow-hidden">
              <div className="relative h-full max-h-[23.725rem] w-full overflow-hidden">
                <Image
                  src="/images/exampleCode.png"
                  alt="example code"
                  fill
                  sizes="(min-width: 1024px) 100vw, 50vw"
                  priority
                />
                <Button
                  variant="demo"
                  shape="rounded"
                  className="top-[35%] translate-x-[25%]"
                  aria-label="detected vulnerability"
                >
                  🚨 {demoCodeResults[0]["name"]}
                </Button>
                <Button
                  variant="demo"
                  shape="rounded"
                  className="top-[70%] translate-x-[140%]"
                  aria-label="detected vulnerability"
                >
                  🚨 {demoCodeResults[1]["name"]}
                </Button>
              </div>
              <div className="mt-[1.71rem] flex flex-col gap-y-6">
                {demoCodeResults.map((item, index) => (
                  <CodeResultsListItem key={index} {...item} />
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>
      <section className="flex-col-center w-fit! gap-y-[2.125rem] leading-tight text-primary-500">
        <FadeInUpAnimation
          as="h3"
          texts={["최신 보안 동향을", "실시간으로 확인하세요."]}
          className="flex-col-end-center w-full space-y-3 truncate text-clamp-3xl font-bold -tracking-[0.011em]"
        />
        <p className="flex-col-end-center w-full space-y-2 text-[1.4rem] font-medium -tracking-[0.011em] text-gray-default sm:text-2xl">
          <span>실시간으로 최신 보안 동향을 제공하여</span>
          <span>개발자들이 보안 취약점에 대한 최신 정보를 받을 수 있어</span>
          <span>
            보안 강화를 위한 코딩 관행을 지속적으로 개선할 수 있습니다.
          </span>
        </p>
      </section>
    </section>
  );
}
