import { FileResultProps } from "@/types/file";
import ResultInfoBox from "./ResultInfoBox";
import { Dispatch, SetStateAction } from "react";

type ResultListProps = {
  results: FileResultProps[];
  setDetectedLines: Dispatch<SetStateAction<number[]>>;
};

const ResultInfoBoxList: React.FC<ResultListProps> = ({
  results,
  setDetectedLines,
}) => {
  return (
    <div className="mt-10 flex flex-col gap-y-6">
      {results.map((result, index) => (
        <ResultInfoBox key={index} setLines={setDetectedLines} {...result} />
      ))}
    </div>
  );
};

export default ResultInfoBoxList;
