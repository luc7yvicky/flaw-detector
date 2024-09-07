import { cn } from "@/lib/utils";

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
  return (
    <ul
      className={cn(
        "h-[36.25rem] w-full rounded-[1.25rem] border border-[#CFCFCF] px-9 py-5",
        className,
      )}
      {...props}
    >
      {topics.map((topic, index) => (
        <li
          key={index}
          className={cn(
            "border-b border-line-light py-4 text-lg font-medium leading-[1.361rem] tracking-[-0.01em]",
            index === topics.length - 1 && "border-none",
          )}
        >
          {index + 1}. {topic}
        </li>
      ))}
    </ul>
  );
};
