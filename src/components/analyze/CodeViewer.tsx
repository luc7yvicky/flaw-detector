"use client";

import { useFileContent } from "@/lib/queries/useFileContent";
import { cn } from "@/lib/utils";
import { useFileViewerStore } from "@/stores/useFileViewerStore";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { IconMagnifierWithPlus } from "../ui/Icons";

const SyntaxHighlighter = dynamic(
  () => import("react-syntax-highlighter").then((mod) => mod.Prism),
  { ssr: false },
);

interface CodeViewerProps {
  username: string;
  repo: string;
}

export default function CodeViewer({
  username,
  repo,
  className,
}: CodeViewerProps & React.HTMLAttributes<HTMLDivElement>) {
  const codeRef = useRef<HTMLPreElement>(null);

  const { currentFile, setCurrentFile, setCurrentRepo } = useFileViewerStore();
  const detectedLines = useFileViewerStore((state) => state.detectedLines);

  const { data, isLoading, error } = useFileContent(
    username,
    repo,
    currentFile,
  );

  const [highlighterStyle, setHighlighterStyle] = useState({});

  useEffect(() => {
    setCurrentFile(null);
    setCurrentRepo(repo);
  }, [repo, setCurrentFile, setCurrentRepo]);

  useEffect(() => {
    import("react-syntax-highlighter/dist/esm/styles/prism/one-light").then(
      (mod) => setHighlighterStyle(mod.default),
    );
  }, []);

  // 위치 보기 하이라이트
  useEffect(() => {
    const lines = codeRef.current?.querySelectorAll(":scope > code > span");
    lines?.forEach((line, index) => {
      const lineNumber = index + 1;

      if (detectedLines.includes(lineNumber)) {
        line.setAttribute("target", "detected");
        line.classList.add("block");
        line.classList.add("mb-[0.125rem]");
        line.classList.add("bg-red-light");
      } else {
        line.removeAttribute("target");
        line.classList.remove("block");
        line.classList.remove("mb-[0.125rem]");
        line.classList.remove("bg-red-light");
      }

      const targetLine = codeRef.current?.querySelector(
        'span[target="detected"]',
      );
      if (targetLine) {
        targetLine.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }, [detectedLines]);

  const renderContent = (): string => {
    if (isLoading) {
      return "Loading...";
    }

    if (error) {
      return `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
    }

    if (data) {
      if (data.type === "image") {
        return `// ${data.path}\n\n${data.message}`;
      } else if (data.type === "code") {
        return `// ${data.path}\n\n${data.content}`;
      }
    }

    return "";
  };

  if (!data && !isLoading && !error) {
    return (
      <div className="flex-center-center size-full flex-col gap-8 rounded-lg border border-[#c3c3c3]">
        <IconMagnifierWithPlus />
        <div className="text-2xl text-primary-500">파일을 선택하세요</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-lg border border-[#c3c3c3]",
        className,
      )}
    >
      {/* <ProcessStatus status={status} /> */}
      <SyntaxHighlighter
        language={data?.type === "code" ? data.language : "text"}
        style={highlighterStyle}
        showLineNumbers
        wrapLines
        className="p-11"
        PreTag={({ children, ...props }) => (
          <pre
            {...props}
            className="!m-0 h-full w-full max-w-full !overflow-x-auto"
            ref={codeRef}
          >
            {children}
          </pre>
        )}
      >
        {renderContent()}
      </SyntaxHighlighter>
    </div>
  );
}
