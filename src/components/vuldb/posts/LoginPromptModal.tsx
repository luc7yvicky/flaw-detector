"use client";

import { useTransition } from "react";

import Button from "@/components/ui/Button";
import { Modal, ModalTitle, ModalTitleWrapper } from "@/components/ui/Modal";

export default function LoginPromptModal() {
  const [_, startTransition] = useTransition();

  return (
    <Modal variant="login" size="small" className="-top-[28.8%] px-0" isOpen>
      <ModalTitleWrapper variant="login">
        <ModalTitle className="text-xl font-medium leading-[1.513rem]">
          자세한 정보를 보고싶다면?
        </ModalTitle>
      </ModalTitleWrapper>
      <Button
        variant="outlined"
        shape="pill"
        className="h-[4.625rem] p-[1.25rem_2rem] text-[1.75rem] font-light leading-[2.118rem] tracking-[-0.01em]"
        onClick={() =>
          startTransition(async () => {
            const { loginWithGithub } = await import("@/lib/actions");
            await loginWithGithub();
          })
        }
      >
        Login
      </Button>
    </Modal>
  );
}
