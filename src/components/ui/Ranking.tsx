"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export type RankingProps = React.HTMLAttributes<HTMLUListElement> & {};

const topics = [
  "유닛테스트",
  "웹뷰 프레임워크",
  "허프만 코딩 구현",
  "테스트 커버리지",
  "코드형 인프라(IaC)",
  "클린 아키텍쳐",
  "UI 라이브러리 개발",
  "AWS Personalize",
  "키클락",
  "클린 코어",
];

export const Ranking: React.FC<RankingProps> = ({ className, ...props }) => {
  const [highlightedTopic, setHighlightedTopic] = useState<number>(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setHighlightedTopic(
        (prevIndex: number) => (prevIndex + 1) % topics.length,
      );
    }, 5000); // 5초마다 highlightedTopic 변경 (임시)

    return () => clearInterval(intervalId);
  }, []);

  return (
    <ul
      className={cn(
        "h-[36.25rem] w-[21.625rem] rounded-lg border border-line-default p-5",
        className,
      )}
      {...props}
    >
      {topics.map((topic, index) => (
        <li
          key={index}
          className={cn(
            "border-b border-line-light py-4 pl-1 text-lg font-medium leading-[21.78px] tracking-[-0.01em]",
            index === topics.length - 1 && "border-none",
            index === highlightedTopic && "text-primary-500",
          )}
        >
          {index + 1}. {topic}
        </li>
      ))}
    </ul>
  );
};
