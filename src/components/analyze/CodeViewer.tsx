"use client";
import { IconEmptyFolder, IconMagnifierWithPlus } from "../ui/Icons";

import ProcessStatus from "./ProcessStatus";

type CodeViewerProps = {
  type: "asIs" | "toBe";
  status?: "inProgress" | "done";
  code?: string;
};

export default function CodeViewer({ type, status, code }: CodeViewerProps) {
  const renderContent = () => {
    if (code) {
      return (
        <div>
          <ProcessStatus status={status} />
          {code}
        </div>
      );
    }
    return (
      <div className="flex-center-center flex-col gap-8">
        {type === "asIs" ? <IconMagnifierWithPlus /> : <IconEmptyFolder />}
        <div
          className={`text-2xl ${type === "asIs" ? "text-primary-500" : "text-black"}`}
        >
          {type === "asIs" ? "파일을 선택하세요" : "분석할 파일이 없어요!"}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-center-center min-h-[calc(100dvh-136px-80px-28px-3rem)] w-full flex-col rounded-lg border border-[#c3c3c3] p-11">
      {renderContent()}
    </div>
  );
}
