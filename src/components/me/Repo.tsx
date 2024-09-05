import { RepoListData } from "@/types/type";
import Link from "next/link";
import Button from "../ui/Button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardSubTitle,
  CardTitle,
} from "../ui/Card";
import { IconBug, IconCaretLeft } from "../ui/Icons";
import { Label, LabelProps } from "../ui/Label";
import { cn } from "@/lib/utils";

export default function Repo({
  id,
  repositoryName,
  detectedStatus = "notChecked",
  createdAt = "24.01.01",
}: RepoListData) {
  const labelStatus: Record<
    RepoListData["detectedStatus"],
    LabelProps["variant"]
  > = {
    done: "clipping-notify",
    onProgress: "clipping",
    notChecked: null,
  };

  return (
    <Link href={`/repos/${repositoryName}`}>
      <Card key={id}>
        <CardHeader>
          <div>
            {labelStatus[detectedStatus] && (
              <Label variant={labelStatus[detectedStatus]}>
                {detectedStatus === "done" ? "검사완료" : "검사중"}
              </Label>
            )}
          </div>
          <CardTitle size="big" className="leading-[2.45rem]">
            {repositoryName}
          </CardTitle>
        </CardHeader>
        <CardFooter>
          <Button
            variant="filled"
            shape="rounded"
            className={cn(
              "flex-between-center h-12 w-full max-w-[9.153rem] rounded-[0.875rem] p-[0.625rem]",
              detectedStatus === "done" && "bg-neutral-100",
            )}
          >
            <IconBug
              width="1.153rem"
              height="1.153rem"
              className="fill-white"
            />
            <span className="text-xl font-medium leading-7">
              {detectedStatus === "done" ? "결과보기" : "검사하기"}
            </span>
            <IconCaretLeft className="size-6 rotate-180 fill-white" />
          </Button>
          <CardSubTitle className="items-end leading-none">
            {createdAt}
          </CardSubTitle>
        </CardFooter>
      </Card>
    </Link>
  );
}
