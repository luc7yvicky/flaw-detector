import { FileResultProps } from "@/types/file";
import {
  InfoBox,
  InfoBoxDescriptionList,
  InfoBoxDescriptionListItem,
  InfoBoxDescriptionText,
  InfoBoxHeader,
  InfoBoxTitle,
} from "../ui/InfoBox";
import { Label } from "../ui/Label";
import CodeBlock from "./CodeBlock";
import { Dispatch, SetStateAction } from "react";

type ResultInfoBoxProps = FileResultProps & {
  setLines: Dispatch<SetStateAction<number[]>>;
};

export default function ResultInfoBox({
  name,
  vulnerability,
  descriptions,
  lines,
  modified_codes,
  setLines,
}: ResultInfoBoxProps) {
  const modifiedCodeStr = modified_codes?.join("\n") ?? "";

  let linesRange: number[] = [];
  if (lines.includes(",")) {
    const ranges = lines.split(",");
    ranges.forEach((range) => {
      if (range.includes("-")) {
        const [start, end] = range.split("-").map(Number);
        for (let i = start; i < end + 1; i++) {
          linesRange.push(i);
        }
      } else {
        linesRange.push(Number(range));
      }
    });
  } else if (lines.includes("-")) {
    let [start, end] = lines.split("-").map(Number);

    for (let i = start; i < end + 1; i++) {
      linesRange.push(i);
    }
  } else {
    linesRange.push(Number(lines));
  }

  return (
    <InfoBox>
      <InfoBoxHeader>
        <InfoBoxTitle>{name}</InfoBoxTitle>
        <Label
          variant="location"
          className="cursor-pointer border-accent-red text-accent-red"
          onClick={() => setLines(linesRange)}
        >
          위치보기
        </Label>
      </InfoBoxHeader>
      <div className="flex flex-col gap-y-5">
        <InfoBoxDescriptionList>
          <InfoBoxDescriptionListItem>{`취약점: ${vulnerability}`}</InfoBoxDescriptionListItem>
        </InfoBoxDescriptionList>
        <InfoBoxDescriptionText>
          {descriptions?.map((desc, index) => <span key={index}>{desc}</span>)}
        </InfoBoxDescriptionText>
      </div>
      {modified_codes && (
        <div className="mt-8">
          <InfoBoxTitle color="gray">수정된 코드</InfoBoxTitle>
          <CodeBlock>{modifiedCodeStr}</CodeBlock>
        </div>
      )}
    </InfoBox>
  );
}
