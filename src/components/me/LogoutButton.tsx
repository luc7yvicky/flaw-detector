"use client";

import { useState } from "react";
import Button from "../ui/Button";
import { Modal, ModalTitle } from "../ui/Modal";
import { signOut } from "next-auth/react";
import { deleteUserData } from "@/lib/api/users";
import { useFileBookmarkStore } from "@/stores/useFileBookmarkStore";

export default function LogoutButton({ username }: { username: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const clearAllBookmarks = useFileBookmarkStore(
    (state) => state.clearAllBookmarks,
  );

  const onClickLogout = async () => {
    try {
      await deleteUserData(username);
      await signOut();
      clearAllBookmarks();
    } catch (err) {
      console.error("Error during logout process: ", err);
    }
  };

  return (
    <>
      <Button
        variant="filled-light-purple"
        shape="rounded"
        className="flex-center-center px-5 py-4 font-medium"
        onClick={() => setIsModalOpen(true)}
      >
        로그아웃
      </Button>
      {isModalOpen && (
        <Modal
          variant="selectFile"
          size="large"
          className="min-h-[25.125rem] w-[50.5rem] gap-y-[3.313rem]"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <div className="flex-col-center-center gap-y-4">
            <h3>
              <ModalTitle className="text-[1.75rem] font-semibold leading-[2.45rem] text-gray-dark">
                정말 로그아웃 할까요?
              </ModalTitle>
            </h3>
            <p className="flex-col-center-center text-xl leading-7 text-[#8F8F8F]">
              <span>
                소스코드 보안을 위하여 모든 히스토리와 코드 저장 내역이
                삭제됩니다.
              </span>
              <span>
                아래 버튼을 누르면 모든 데이터를 삭제하게 되고 로그아웃 처리가
                됩니다.
              </span>
            </p>
          </div>
          <div className="flex-between-center w-full space-x-4 text-2xl leading-[2.1rem]">
            <button
              className="flex-center-center h-[3.625rem] w-full rounded-xl border bg-bggray-light text-line-default"
              onClick={() => setIsModalOpen(false)}
            >
              닫기
            </button>
            <button
              className="flex-center-center h-[3.625rem] w-full rounded-xl bg-primary-500 p-[0.75rem_1.5rem] text-white"
              onClick={onClickLogout}
            >
              확인
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
