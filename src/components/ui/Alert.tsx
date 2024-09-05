"use client";

import { cn } from "@/lib/utils";
import Button from "./Button";
import {
  IconArrowsCounterClockwise,
  IconCheck,
  IconClose,
  IconHourGlass,
} from "./Icons";
import { useState, Dispatch, SetStateAction } from "react";
import { useFileViewerStore } from "@/stores/store";
import Link from "next/link";

const alertType = {
  onCheck: {
    icon: <IconArrowsCounterClockwise />,
    title: "검사 중...",
    description: "코드가 많을수록 처리시간이 길어집니다.",
  },
  onWait: {
    icon: <IconHourGlass />,
    title: "검사 대기 중",
    description: [
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
    description: ["오류가 발생했습니다.", "다시 시도해주세요."],
  },
  success: {
    icon: (
      <div className="flex-center-center size-[2.438rem] rounded-[50%] bg-primary-500">
        <IconCheck className="size-[1.25rem] fill-white stroke-white stroke-1" />
      </div>
    ),
    title: "프로젝트 검사 완료",
    description: "검사 결과를 확인해보세요.",
  },
};

type AlertType = {
  status: keyof typeof alertType | null;
} & React.HTMLAttributes<HTMLDivElement>;

export const AlertIcon = ({ icon }: { icon: React.ReactNode }) => {
  return <div className="flex basis-12 justify-center">{icon}</div>;
};

export const RetryButton = () => {
  // 클릭 시, 검사를 시작하는 함수 추가 예정

  return (
    <Button
      variant="filled"
      shape="rounded"
      className="w-full rounded-[0.75rem] py-3 text-2xl font-medium leading-[2.1rem]"
    >
      다시 시도하기
    </Button>
  );
};

export const ViewResultsButton = () => {
  const repoName = useFileViewerStore((state) => state.currentRepo);
  const filePath = useFileViewerStore((state) => state.currentFile);

  return (
    <Link href={`/repos/${repoName}/${filePath}`}>
      <Button
        variant="filled"
        shape="rounded"
        className="w-full rounded-[0.75rem] py-3 text-2xl font-medium leading-[2.1rem]"
      >
        결과 보러가기
      </Button>
    </Link>
  );
};

export const AlertContent = ({
  status,
  title,
  description,
}: {
  status: keyof typeof alertType;
  title: string;
  description: string | string[];
}) => {
  const renderButton = () => {
    if (status === "error") {
      return <RetryButton />;
    }
    if (status === "success") {
      return <ViewResultsButton />;
    }
  };

  return (
    <div className="flex grow flex-col gap-y-4 text-xl font-medium leading-7">
      <h4>{title}</h4>
      <h5 className="flex flex-col text-[1.125rem] text-gray-default">
        {Array.isArray(description)
          ? description.map((desc, index) => <span key={index}>{desc}</span>)
          : description}
      </h5>
      {renderButton()}
    </div>
  );
};

export const AlertClose = ({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className="shrink-0 basis-8">
      <IconClose
        className="size-8 cursor-pointer"
        onClick={() => setIsOpen(false)}
      />
    </div>
  );
};

export const Alert = ({
  status = "onWait",
  className,
  ...props
}: AlertType) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!status) {
    return null;
  }
  
  const { icon, title, description } = alertType[status];

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
          <AlertIcon icon={icon} />
          <AlertContent
            status={status}
            title={title}
            description={description}
          />
          <AlertClose setIsOpen={setIsOpen} />
        </div>
      )}
    </>
  );
};
