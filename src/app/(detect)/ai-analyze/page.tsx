"use client";
import CodeViewer from "@/components/analyze/CodeViewer";
import FileList from "@/components/analyze/FileList";
import {
  Status,
  StatusError,
  StatusSuccess,
  StatusWarning,
} from "@/components/analyze/Status";
import Button from "@/components/ui/Button";
import { InputChip } from "@/components/ui/InputChip";
import ProgressBar from "@/components/ui/ProgressBar";
import TitleBar from "@/components/ui/TitleBar";

export default function AiAnalyze() {
  const counts = {
    error: 8,
    warning: 12,
    success: 23,
  };

  return (
    <section className="px-[1rem] mx-auto w-full max-w-[110rem]">
      <TitleBar title="sfacweb-01" />
      <div className="grid grid-cols-[16rem_1fr] gap-7">
        <Button>선택한 파일 검사</Button>
        <div className="border-line-default rounded-lg border p-5">
          <ProgressBar value={0.7} className="mb-5" />
          <div className="flex gap-7">
            <InputChip selected percentage="75%">
              page.tsx
            </InputChip>
            <InputChip>page.tsx</InputChip>
          </div>
        </div>
        <div>
          <Status className="mb-6">
            <StatusError>{counts.error}</StatusError>
            <StatusWarning>{counts.warning}</StatusWarning>
            <StatusSuccess>{counts.success}</StatusSuccess>
          </Status>
          <FileList />
        </div>
        <div className="flex gap-7 md:flex-col lg:flex-row">
          <CodeViewer type="asIs" />
          <CodeViewer type="toBe" />
        </div>
      </div>
    </section>
  );
}
