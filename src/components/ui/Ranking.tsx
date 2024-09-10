import { SearchKeyword } from "@/lib/api/searchKeywords";
import { cn } from "@/lib/utils";

export type RankingProps = React.HTMLAttributes<HTMLUListElement> & {
  topSearchKeywords: SearchKeyword[];
};

const dummySearchKeywords: string[] = [
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

const renderTopics = (
  topics: string[] | SearchKeyword[],
  haveSearchKeywords: boolean,
) => {
  return topics.map((topic, index) => {
    const topicName = typeof topic === "string" ? topic : topic.keyword;

    return (
      <li
        key={topicName}
        className={cn(
          "animate-fadeIn border-b border-line-light py-4 text-lg font-medium leading-[1.361rem] tracking-[-0.01em]",
          index === topics.length - 1 && "border-none",
          !haveSearchKeywords && "select-none blur-md",
        )}
      >
        {index + 1}. {topicName}
      </li>
    );
  });
};

export const Ranking: React.FC<RankingProps> = ({
  className,
  topSearchKeywords,
  ...props
}) => {
  return (
    <ul
      className={cn(
        "relative h-[36.25rem] w-full rounded-[1.25rem] border border-[#CFCFCF] px-9 py-5",
        className,
      )}
      {...props}
    >
      {topSearchKeywords.length > 0 ? (
        renderTopics(topSearchKeywords, true)
      ) : (
        <>
          {renderTopics(dummySearchKeywords, false)}
          <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform whitespace-nowrap text-xl font-medium">
            데이터를 준비중입니다.
          </p>
        </>
      )}
    </ul>
  );
};
