"use client";

import { useFileViewerStore } from "@/stores/store";

import { IconMagnifierWithPlus } from "../ui/Icons";
import { getLanguage } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const SyntaxHighlighter = dynamic(
  () => import("react-syntax-highlighter").then((mod) => mod.Prism),
  { ssr: false },
);

export default function CodeViewer() {
  const { currentFile, fileContent, isLoading, error } = useFileViewerStore();
  const [highlighterStyle, setHighlighterStyle] = useState({});

  useEffect(() => {
    import("react-syntax-highlighter/dist/esm/styles/prism/one-light").then(
      (mod) => setHighlighterStyle(mod.default),
    );
  }, []);

  const renderContent = (): string => {
    if (isLoading) {
      return "Loading...";
    }

    if (error) {
      return `Error: ${error}`;
    }

    return fileContent || "";
  };

  if (!currentFile && !isLoading && !error) {
    return (
      <div className="flex-center-center h-full flex-col gap-8 rounded-lg border border-[#c3c3c3]">
        <IconMagnifierWithPlus />
        <div className="text-2xl text-primary-500">파일을 선택하세요</div>
      </div>
    );
  }

  return (
    <div className="w-full flex-col overflow-hidden rounded-lg border border-[#c3c3c3]">
      {/* <ProcessStatus status={status} /> */}
      <SyntaxHighlighter
        language={currentFile ? getLanguage(currentFile) : "text"}
        style={highlighterStyle}
        // showLineNumbers
        wrapLines
        className="p-11"
        PreTag={({ children, ...props }) => (
          <pre {...props} className="!m-0 h-full">
            {children}
          </pre>
        )}
      >
        {renderContent()}
      </SyntaxHighlighter>
    </div>
  );
}
