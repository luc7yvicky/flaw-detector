"use client";

import Button from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function error({
  error,
  reset,
}: {
  error: Error & { digest?: string; statusCode?: number };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Error occurred:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      digest: error.digest,
    });
  }, [error]);

  const getErrorMessage = (): string => {
    // HTTP 상태 코드가 있는 경우 우선 처리
    if (error.statusCode && error.statusCode in ERROR_MESSAGES) {
      return ERROR_MESSAGES[error.statusCode as ErrorType];
    }

    // 에러 이름으로 메시지 찾기
    const errorName = error.name as ErrorType;
    if (errorName in ERROR_MESSAGES) {
      return ERROR_MESSAGES[errorName];
    }

    // 기본 메시지 반환
    return ERROR_MESSAGES.Default;
  };

  const getErrorStatusCode = () => {
    switch (error.name) {
      case "NotFoundError":
        return 404;
      case "AuthorizationError":
        return 403;
      case "ValidationError":
        return 400;
      case "RateLimitError":
        return 429;
      default:
        return 500;
    }
  };

  return (
    <section className="flex h-[calc(100dvh-8.5rem)] items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-md flex-col items-center justify-center rounded-lg p-8 text-center">
        <h1 className="mb-2 text-4xl font-bold text-gray-900">
          오류가 발생했습니다
        </h1>
        <p className="mb-6 text-xl text-gray-700">{getErrorMessage()}</p>
        <div className="mb-8 text-sm text-gray-500">
          <p>에러 코드: {getErrorStatusCode()}</p>
          {/* {error.digest && <p>Reference ID: {error.digest}</p>} */}
        </div>
        <div className="mb-8 flex gap-2">
          <Button className="w-fit" onClick={() => reset()} variant="outlined">
            다시 시도하기
          </Button>
          <Button className="w-fit" variant='filled'>
            <Link href="/" passHref>
              홈으로 가기
            </Link>
          </Button>
        </div>
        <p className="text-sm text-gray-500">
          문제가 계속되면 고객센터로 문의해주세요.
        </p>
      </div>
    </section>
  );
}

// HTTP 상태 코드 타입
export type HttpStatusCode = 400 | 401 | 403 | 429 | 500 | 502 | 503 | 504;

// 커스텀 에러 타입
export type CustomErrorType =
  | "NetworkError"
  | "AuthError"
  | "DataError"
  | "Default";

// 모든 에러 타입
export type ErrorType = HttpStatusCode | CustomErrorType;

// 에러 메시지 타입
export type ErrorMessageType = {
  [key in ErrorType]: string;
};

// 에러 메시지 상수
export const ERROR_MESSAGES: ErrorMessageType = {
  400: "잘못된 요청입니다.",
  401: "인증이 필요한 페이지입니다.",
  403: "접근 권한이 없습니다.",
  429: "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.",
  500: "서버에 문제가 발생했습니다.",
  502: "서버가 일시적으로 응답하지 않습니다.",
  503: "서비스를 일시적으로 사용할 수 없습니다.",
  504: "서버 응답 시간이 초과되었습니다.",

  // 커스텀 에러
  NetworkError: "네트워크 연결에 문제가 발생했습니다.",
  AuthError: "로그인이 필요하거나 권한이 없습니다.",
  DataError: "데이터를 불러오는 중 문제가 발생했습니다.",
  Default: "예기치 못한 문제가 발생했습니다.",
} as const;

// 에러 타이틀 매핑
export const getErrorTitle = (statusCode?: number): string => {
  if (statusCode) {
    if (statusCode >= 500) return "서버 오류";
    if (statusCode >= 400) return "클라이언트 오류";
  }
  return "오류가 발생했습니다";
};
