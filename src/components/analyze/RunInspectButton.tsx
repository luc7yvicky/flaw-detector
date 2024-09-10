"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import { List, Modal, ModalTitle } from "../ui/Modal";
import { useFileSelectionStore } from "@/stores/useFileSelectionStore";
import { useFileProcessStore } from "@/stores/useFileProcessStore";
import { useQuery } from "@tanstack/react-query";
import { getRepoTree, RepoTreeResult } from "@/lib/api/repositories";
import { formatFileSize } from "@/lib/utils";

export default function RunInspectButton({
  repo,
  username,
}: {
  repo: string;
  username: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scanType, setScanType] = useState<"selected" | "full">("selected");
  const [error, setError] = useState<string | null>(null);
  const {
    getSelectedFilesCount,
    getSelectedFiles,
    initializeSelectedFilesStatus,
  } = useFileSelectionStore();
  const { resetFileStatuses, processFiles } = useFileProcessStore();
  const selectedFilesCount = getSelectedFilesCount();

  const {
    data: repoTreeResult,
    refetch: refetchRepoTree,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["repoTree", username, repo],
    queryFn: () => getRepoTree(username, repo),
    enabled: false, // 초기에는 실행하지 않음
    retry: 1, // 실패 시 1번 재시도
  });

  // useEffect(() => {
  //   if (repoTreeResult) {
  //     console.log(
  //       "Repository Tree Structure:",
  //       JSON.stringify(repoTreeResult, null, 2),
  //     );
  //   }
  // }, [repoTreeResult]);

  useEffect(() => {
    if (scanType === "full" && isModalOpen) {
      refetchRepoTree();
    }
  }, [scanType, isModalOpen, refetchRepoTree]);

  const openModal = () => {
    setScanType(selectedFilesCount > 0 ? "selected" : "full");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  const handleSelectedFilesInspect = async () => {
    const selectedFiles = getSelectedFiles();
    try {
      await processFiles(selectedFiles, username, repo, "analyze");
      console.log("선택된 파일 처리가 완료되었습니다.");
    } catch (error) {
      console.error("파일 처리 중 오류 발생:", error);
      setError("파일 처리 중 오류가 발생했습니다.");
    }
  };

  const handleFullRepoInspect = async () => {
    try {
      if (repoTreeResult) {
        const allFiles = repoTreeResult.tree.filter(
          (item) => item.type === "file",
        );
        // TODO: 파일 처리 분산화 로직
        console.log(allFiles);
        // await processFiles(allFiles, username, repo, "analyze");
        console.log(
          `전체 레포지토리 처리가 완료되었습니다. ${repoTreeResult.ignoredCount}개의 파일이 무시되었습니다.`,
        );
      } else {
        console.error("레포지토리 구조를 가져오는데 실패했습니다.");
        setError("레포지토리 구조를 가져오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("전체 레포지토리 처리 중 오류 발생:", error);
      setError("전체 레포지토리 처리 중 오류가 발생했습니다.");
    }
  };
  const handleInspect = async () => {
    if (!username || !repo) {
      console.error("사용자 정보를 찾을 수 없습니다.");
      setError("사용자 정보를 찾을 수 없습니다.");
      return;
    }

    closeModal();
    resetFileStatuses();
    initializeSelectedFilesStatus();

    if (scanType === "selected") {
      await handleSelectedFilesInspect();
    } else {
      await handleFullRepoInspect();
    }
  };

  const fileCount = useMemo(() => {
    if (repoTreeResult) {
      return repoTreeResult.tree.filter((item) => item.type === "file").length;
    }
    return 0;
  }, [repoTreeResult]);

  const renderFileList = () => {
    if (scanType === "selected") {
      const selectedFiles = getSelectedFiles();
      return (
        <List
          items={selectedFiles.map(({ path, name }) => ({
            name,
            path,
            size: undefined,
          }))}
          totalFileCount={selectedFilesCount}
          ignoredCount={0}
        />
      );
    }

    if (repoTreeResult) {
      const fileItems = repoTreeResult.tree.filter(
        (item) => item.type === "file",
      );
      return (
        <List
          items={fileItems.map((item) => ({
            name: item.name,
            path: item.path,
            size: item.size,
          }))}
          totalFileCount={fileItems.length + repoTreeResult.ignoredCount}
          ignoredCount={repoTreeResult.ignoredCount}
        />
      );
    }

    return <p>레포지토리 구조를 불러오는 중...</p>;
  };

  return (
    <>
      <Button className="h-[6.75rem] w-full" onClick={openModal}>
        {selectedFilesCount
          ? `선택한 파일 검사 (${selectedFilesCount})`
          : `레포지토리 전체 검사`}
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
            {scanType === "selected"
              ? `선택한 파일 ${selectedFilesCount}개를 검사하시겠습니까?`
              : "전체 레포지토리를 검사하시겠습니까?"}
          </ModalTitle>

          {renderFileList()}

          <div className="flex gap-3">
            <Button variant="outlined" onClick={closeModal}>
              취소
            </Button>
            {selectedFilesCount > 0 && (
              <Button
                variant="outlined"
                onClick={() =>
                  setScanType(scanType === "selected" ? "full" : "selected")
                }
              >
                {scanType === "selected"
                  ? "전체 검사로 전환"
                  : "선택 검사로 전환"}
              </Button>
            )}
            <Button
              onClick={() => {
                handleInspect();
              }}
            >
              검사하기
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
