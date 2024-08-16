"use client";
import CodeViewer from "@/components/analyze/CodeViewer";
import FileList from "@/components/analyze/FileList";
import Button from "@/components/ui/Button";
import { DummyData } from "@/components/analyze/FileList";

export default function AiAnalyze() {
  return (
    <section className="mx-auto w-full max-w-[110rem]">
      <div className="grid grid-cols-[16rem_1fr] gap-7">
        <Button>선택한 파일 검사</Button>
        <div className="h-[5rem]">[progress bar]</div>
        <div>
          <div>status panel</div>
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
