import { FileResultFailProps, FileResultProps } from "@/types/file";
import CodeResultsListItem from "./CodeResultsListItem";

type CodeResultsListProps = {
  results: FileResultProps[] | FileResultFailProps;
};

const CodeResultsList = ({ results }: CodeResultsListProps) => {
  return (
    <div className="mt-10 flex flex-col gap-y-6">
      {Array.isArray(results) ? (
        // 취약점 검출 O
        <>
          {results.map((result, index) => (
            <CodeResultsListItem key={index} {...result} />
          ))}
        </>
      ) : (
        // 취약점 검출 X
        <div className="flex-col-center-center h-[32.563rem] w-full gap-y-[0.625rem]">
          <h3 className="text-[2rem] font-semibold leading-[2.8rem] tracking-[0.015em] text-gray-dark">
            검출된 취약점이 없어요.
          </h3>
          <p className="flex-col-center-center text-2xl font-normal leading-[2.1rem] text-gray-default">
            <span>취약점이 발견되지 않았지만 새로 업데이트할 경우</span>
            <span>파일을 한 번 더 검사해주세요.</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default CodeResultsList;
