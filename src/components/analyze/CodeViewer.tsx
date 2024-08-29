"use client";
import { IconEmptyFolder, IconMagnifierWithPlus } from "../ui/Icons";

import ProcessStatus from "./ProcessStatus";

type CodeViewerProps = {
  status?: "inProgress" | "done";
  code?: string;
};

export default function CodeViewer({ status, code }: CodeViewerProps) {
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
        <IconMagnifierWithPlus />
        <div className="text-2xl text-primary-500">파일을 선택하세요</div>
      </div>
    );
  };

  return (
    <div className="flex-center-center w-full flex-col rounded-lg border border-[#c3c3c3] p-11">
      {renderContent()}
    </div>
  );
}
