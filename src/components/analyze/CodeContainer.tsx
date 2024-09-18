"use client";

import { cn } from "@/lib/utils";
import { useDetectedModeStore } from "@/stores/useDetectedModeStore";
import { useFileProcessStore } from "@/stores/useFileProcessStore";
import { useFileViewerStore } from "@/stores/useFileViewerStore";
import { useEffect, useState } from "react";
import { Alert } from "../ui/Alert";
import CodeResultsList from "./CodeResultsList";
import CodeViewer from "./CodeViewer";

type CodeContainerProps = {
  username: string;
  repo: string;
};

export default function CodeContainer({ username, repo }: CodeContainerProps) {
  // 현재 파일의 검사 여부
  const currentFile = useFileViewerStore((state) => state.currentFile);
  const fileStatuses = useFileProcessStore((state) => state.fileStatuses);
  const getFileStatus = useFileProcessStore((state) => state.getFileStatus);
  const status = currentFile ? getFileStatus(currentFile) : null;

  // 현재 파일의 검사 결과
  const getMode = useDetectedModeStore((state) => state.getMode);
  const setMode = useDetectedModeStore((state) => state.setMode);
  const mode = currentFile ? getMode(currentFile) : null;
  const results = useFileProcessStore((state) => state.fileDetectedResults);

  const [isAlertOpen, setIsAlertOpen] = useState(true);

  useEffect(() => {
    console.log("status", fileStatuses.values().next().value);
  }, [fileStatuses]);

  useEffect(() => {
    if (currentFile) {
      if (!status) {
        setIsAlertOpen(false);
      }
      setIsAlertOpen(true);
    }
  }, [currentFile, status, setIsAlertOpen]);

  useEffect(() => {
    if (currentFile) {
      setMode(currentFile, "undetected");
    }
  }, [currentFile, results, setMode]);

  return (
    <section className={cn("relative w-full overflow-hidden")}>
      {/* 코드 뷰어 */}
      <CodeViewer
        username={username}
        repo={repo}
        className={
          results && mode === "detected" && status === "success"
            ? "h-full max-h-[34.688rem]"
            : ""
        }
      />
      {status && (
        <Alert
          username={username}
          status={status}
          isOpen={isAlertOpen}
          onClose={() => setIsAlertOpen(false)}
        />
      )}

      {/* 검사 결과 */}
      {results && mode === "detected" && status === "success" && (
        <CodeResultsList results={results} />
      )}
    </section>
  );
}
