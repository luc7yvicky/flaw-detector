"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { useFileProcessStore, useFileSelectionStore } from "@/stores/store";
import { List, Modal, ModalTitle } from "../ui/Modal";

export default function RunInspectButton({
  repo,
  username,
}: {
  repo: string;
  username: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isProcessing, setIsProcessing] = useState(false);
  const {
    getSelectedFilesCount,
    getSelectedFiles,
    initializeSelectedFilesStatus,
  } = useFileSelectionStore();
  const { resetFileStatuses, processFiles, setFileStatus } =
    useFileProcessStore();
  const selectedFilesCount = getSelectedFilesCount();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleInspect = async () => {
    if (!username || !repo) {
      console.error("사용자 정보를 찾을 수 없습니다.");
      return;
    }

    closeModal();
    // setIsProcessing(true);
    resetFileStatuses();
    initializeSelectedFilesStatus();
    const selectedFiles = getSelectedFiles();

    try {
      await processFiles(selectedFiles, username, repo, "analyze");
      console.log("모든 파일 처리가 완료되었습니다.");
    } catch (error) {
      console.error("파일 처리 중 오류 발생:", error);
    } finally {
      // setIsProcessing(false);
    }
  };

  return (
    <>
      <Button
        className="h-[6.75rem] w-full"
        onClick={openModal}
        disabled={selectedFilesCount === 0}
      >
        선택한 파일 검사 ({selectedFilesCount})
      </Button>
      {isModalOpen && (
        <Modal
          variant="selectFile"
          size="large"
          isOpen={isModalOpen}
          onClose={closeModal}
          className="flex-col justify-between"
        >
          <ModalTitle size="default" weight="semi-bold">
            선택한 파일 {selectedFilesCount}개를 검사하시겠습니까?
          </ModalTitle>
          <List
            items={getSelectedFiles().map(({ path, name }) => ({
              title: name,
              subtitle: path,
              date: new Date().toLocaleDateString(),
            }))}
          />
          <div className="flex gap-3">
            <Button variant="outlined" onClick={closeModal}>
              취소
            </Button>
            <Button onClick={handleInspect}>검사하기</Button>
          </div>
        </Modal>
      )}
    </>
  );
}
