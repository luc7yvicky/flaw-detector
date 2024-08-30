import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/** Firestore의 timestamp 형식에서 string 타입(#일 전)으로 변환합니다.*/
export const formatTimestampAsDaysAgo = (timestamp: {
  seconds: number;
  nanoseconds: number;
}): string => {
  const createdAtDate = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000,
  );
  const now = new Date();

  // 두 날짜 간의 차이 계산 (밀리초 단위)
  const differenceInMs = now.getTime() - createdAtDate.getTime();

  // 차이를 일 단위로 변환
  const daysAgo = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

  return `${daysAgo}일 전`;
};
