"use client";

import Button from "@/components/ui/Button";
import ExceptionHandlingMessage from "@/components/vulnerability-db/ExceptionHandlingMessage";

export default function error() {
  return (
    <section className="flex-center-center mx-auto flex-col">
      <ExceptionHandlingMessage
        situation="페이지를 불러오는 중 오류가 발생했습니다!"
        solution="잠시 후 다시 시도해주세요."
      />
      <Button
        className="mx-auto w-fit"
        onClick={() => window.location.reload()}
        variant="outlined"
      >
        새로고침
      </Button>
    </section>
  );
}
