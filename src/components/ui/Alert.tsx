"use client";

import { cn } from "@/lib/utils";
import { useDetectedModeStore } from "@/stores/useDetectedModeStore";
import { useFileViewerStore } from "@/stores/useFileViewerStore";
import { useState } from "react";
import Button from "./Button";
import {
  IconArrowsCounterClockwise,
  IconCheck,
  IconClose,
  IconHourGlass,
  IconThinClose,
} from "./Icons";

const alertType = {
  onCheck: {
    icon: <IconArrowsCounterClockwise />,
    title: "검사 중...",
    descriptions: ["코드가 많을수록 처리시간이 길어집니다."],
  },
  onWait: {
    icon: <IconHourGlass />,
    title: "검사 대기 중",
    descriptions: [
      "순차적으로 파일 검사가 진행됩니다.",
      "잠시만 대기해주시면 검사가 시작됩니다.",
    ],
  },
  error: {
    icon: (
      <div className="flex-center-center size-[2.438rem] rounded-[50%] bg-accent-red">
        <IconClose className="size-[1.25rem] fill-white" />
      </div>
    ),
    title: "Error",
    descriptions: ["오류가 발생했습니다.", "다시 시도해주세요."],
    button: {
      text: "다시 검사하기",
      action: () => {
        console.log("검사 함수 호출");
      },
    },
  },
  success: {
    icon: (
      <div className="flex-center-center size-[2.438rem] rounded-[50%] bg-primary-500">
        <IconCheck className="size-[1.25rem] fill-white stroke-white stroke-1" />
      </div>
    ),
    title: "프로젝트 검사 완료",
    descriptions: ["검사 결과를 확인해보세요."],
    button: {
      text: "결과 확인하기",
    },
  },
};

type AlertProperty = {
  icon: JSX.Element;
  title: string;
  descriptions: string[];
  button?: {
    text: string;
    action?: () => void;
  };
};

type AlertType = {
  status: keyof typeof alertType | null;
} & React.HTMLAttributes<HTMLDivElement>;

export const Alert = ({
  status = "onWait",
  className,
  ...props
}: AlertType) => {
  const [isOpen, setIsOpen] = useState(true);
  const repoName = useFileViewerStore((state) => state.currentRepo);
  const filePath = useFileViewerStore((state) => state.currentFile);
  const setMode = useDetectedModeStore((state) => state.setMode);

  if (!status) {
    return null;
  }

  const { icon, title, descriptions, button } = alertType[
    status
  ] as AlertProperty;

  const onClickToResults = () => {
    setMode("detected");
    window.history.replaceState({}, "", `/repos/${repoName}/${filePath}`);
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div
          className={cn(
            "absolute right-0 top-0 z-30 flex h-fit w-full max-w-[30.875rem] justify-between gap-x-[1.125rem] rounded-2xl bg-white p-8 shadow-[0_0.75rem_2.656rem_0_rgba(0,0,0,0.12)]",
            className,
          )}
          {...props}
        >
          <div className="flex basis-12 justify-center">{icon}</div>

          <div className="flex grow flex-col gap-y-4 text-xl font-medium leading-7">
            <h4>{title}</h4>
            <p className="flex flex-col text-[1.125rem] text-gray-default">
              {descriptions.map((desc, index) => (
                <span key={index}>{desc}</span>
              ))}
            </p>
            {button &&
              (status === "success" ? (
                <Button
                  variant="filled"
                  shape="rounded"
                  className="w-full rounded-[0.75rem] py-3 text-2xl font-medium leading-[2.1rem]"
                  onClick={onClickToResults}
                >
                  {button.text}
                </Button>
              ) : (
                <Button
                  variant="filled"
                  shape="rounded"
                  className="w-full rounded-[0.75rem] py-3 text-2xl font-medium leading-[2.1rem]"
                  onClick={button.action}
                >
                  {button.text}
                </Button>
              ))}
          </div>

          <div className="shrink-0 basis-8">
            <IconThinClose
              className="size-8 cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};
