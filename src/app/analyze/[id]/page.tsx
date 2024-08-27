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
import Modal from "@/components/ui/Modal";
import ProgressBar from "@/components/ui/ProgressBar";
import TitleBar from "@/components/ui/TitleBar";
import { useState } from "react";

export default function AnalyzePage() {
  const counts = {
    error: 8,
    warning: 12,
    success: 23,
  };

  const [isOpen, setIsOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState<"selectFile" | "processing">(
    "selectFile",
  );
  const openModal = (variant: "selectFile" | "processing") => {
    setModalVariant(variant);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const onProceedProcessing = () => {
    openModal("processing");
  };

  return (
    <section className="mx-auto w-full max-w-[110rem] px-[1rem]">
      <TitleBar title="sfacweb-01" />
      <div className="grid grid-cols-[16rem_1fr] gap-7">
        <Button onClick={() => openModal("selectFile")}>
          선택한 파일 검사
        </Button>
        <div className="rounded-lg border border-line-default p-5">
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
        <div className="mb-7 flex flex-col gap-7 lg:flex-row">
          <CodeViewer type="asIs" />
          <CodeViewer type="toBe" />
        </div>
      </div>
      <Modal
        variant={modalVariant}
        isOpen={isOpen}
        onClose={closeModal}
        onProceed={onProceedProcessing}
      />
    </section>
  );
}
