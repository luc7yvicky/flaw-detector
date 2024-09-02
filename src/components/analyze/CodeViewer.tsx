"use client";

import { useFileViewerStore } from "@/stores/store";

import ProcessStatus from "./ProcessStatus";
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!currentFile || !fileContent) {
    return (
      <div className="flex-center-center flex-col gap-8 rounded-lg border border-[#c3c3c3]">
        <IconMagnifierWithPlus />
        <div className="text-2xl text-primary-500">파일을 선택하세요</div>
      </div>
    );
  }

  return (
    <div className="w-full flex-col overflow-hidden rounded-lg border border-[#c3c3c3]">
      {/* <ProcessStatus status={status} /> */}
      <SyntaxHighlighter
        language={getLanguage(currentFile)}
        style={highlighterStyle}
        // showLineNumbers
        wrapLines
        className="p-11"
        PreTag={({ children, ...props }) => (
          <pre {...props} className="!m-0">
            {children}
          </pre>
        )}
      >
        {fileContent}
      </SyntaxHighlighter>
    </div>
  );
}
