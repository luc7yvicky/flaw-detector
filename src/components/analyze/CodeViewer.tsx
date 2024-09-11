"use client";

import { useFileContent } from "@/lib/queries/useFileContent";
import { cn } from "@/lib/utils";
import { useFileProcessStore } from "@/stores/useFileProcessStore";
import { useFileViewerStore } from "@/stores/useFileViewerStore";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Alert } from "../ui/Alert";
import { IconMagnifierWithPlus } from "../ui/Icons";
import ResultInfoBoxList from "./ResultInfoBoxList";
import { useDetectedModeStore } from "@/stores/useDetectedModeStore";
import { getDetectedResults } from "@/lib/api/repositories";

const SyntaxHighlighter = dynamic(
  () => import("react-syntax-highlighter").then((mod) => mod.Prism),
  { ssr: false },
);

interface CodeViewerProps {
  username: string;
  repo: string;
}

export default function CodeViewer({ username, repo }: CodeViewerProps) {
  const codeRef = useRef<HTMLPreElement>(null);

  const mode = useDetectedModeStore((state) => state.mode);
  const setMode = useDetectedModeStore((state) => state.setMode);
  const { currentFile, setCurrentFile, setCurrentRepo } = useFileViewerStore();
  const { data, isLoading, error } = useFileContent(
    username,
    repo,
    currentFile,
  );
  const getFileStatus = useFileProcessStore((state) => state.getFileStatus);
  const results = useFileProcessStore((state) => state.fileDetectedResults);
  const setResults = useFileProcessStore(
    (state) => state.setFileDetectedResults,
  );
  const filePath = useFileProcessStore((state) => state.currentDetectedFile);
  const status = currentFile ? getFileStatus(currentFile) : null;

  const [highlighterStyle, setHighlighterStyle] = useState({});
  const [hasAlertBeenSet, setHasAlertBeenSet] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [detectedLines, setDetectedLines] = useState<number[]>([]);

  useEffect(() => {
    setCurrentFile(null);
    setCurrentRepo(repo);
  }, [repo, setCurrentFile, setCurrentRepo]);

  useEffect(() => {
    import("react-syntax-highlighter/dist/esm/styles/prism/one-light").then(
      (mod) => setHighlighterStyle(mod.default),
    );
  }, []);

  // 검사 상태에 따른 Alert 출력
  useEffect(() => {
    if (status && !hasAlertBeenSet) {
      setIsAlertOpen(true);
      setHasAlertBeenSet(true);
    }
  }, [status, hasAlertBeenSet]);

  // 취약점 검사 결과 조회 시도
  useEffect(() => {
    setMode("undetected");
    setResults(null);

    const getResults = async () => {
      try {
        const { mode, results } = await getDetectedResults(
          username,
          currentFile,
        );
        setMode(mode);
        setResults(results);
      } catch (err) {
        console.error("Error fetching detected results:", err);
      }
    };

    if (currentFile) {
      getResults();
    }
  }, [currentFile]);

  // 취약점 검사 결과 저장
  useEffect(() => {
    const addDetectedResults = async () => {
      try {
        const res = await fetch("/api/repos/results", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            repo,
            filePath,
            results,
          }),
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to save results.");
        }
      } catch (err) {
        console.error("Error adding results:", err);
      }
    };

    if (status === "success" && results && filePath) {
      addDetectedResults();
      setMode("undetected");
    }
  }, [status]);

  // 위치 보기 하이라이트
  useEffect(() => {
    const lines = codeRef.current?.querySelectorAll(":scope > code > span");
    lines?.forEach((line, index) => {
      const lineNumber = index + 1;

      if (detectedLines.includes(lineNumber)) {
        line.setAttribute("target", "detected");
        line.classList.add("bg-red-light");
      } else {
        line.removeAttribute("target");
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
      <div className="flex-center-center w-full flex-col gap-8 rounded-lg border border-[#c3c3c3]">
        <IconMagnifierWithPlus />
        <div className="text-2xl text-primary-500">파일을 선택하세요</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full overflow-x-scroll",
        results && mode === "detected" && "min-h-dvh",
      )}
    >
      {/* 코드 뷰어 */}
      <div
        className={cn(
          "relative h-full w-full rounded-lg border border-[#c3c3c3] overflow-hidden",
          results && mode === "detected" ? "h-full max-h-[34.688rem]" : "",
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
        {isAlertOpen && <Alert status={status} />}
      </div>
      {/* 검사 결과 */}
      {results && mode === "detected" && (
        <ResultInfoBoxList
          results={results}
          setDetectedLines={setDetectedLines}
        />
      )}
    </div>
  );
}
