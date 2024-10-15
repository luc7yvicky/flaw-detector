import { cn, formatDatetimeToYYMMDD } from "@/lib/utils";
import { RepoListData } from "@/types/repo";
import Link from "next/link";
import { memo } from "react";
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
import RepoBookmark from "./RepoBookmark";

function Repo({
  id,
  repositoryName,
  favorite,
  detectedStatus = "notChecked",
  createdAt,
  username,
}: RepoListData & { username: string }) {
  const labelStatus: Record<
    RepoListData["detectedStatus"],
    LabelProps["variant"]
  > = {
    done: "clipping-notify",
    onProgress: "clipping-etc",
    notChecked: null,
  };

  const onClickRepo = async () => {
    try {
      const res = await fetch("/api/repos", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          repoName: repositoryName,
          clickedAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save results.");
      }
    } catch (err) {
      console.error("Error adding results:", err);
    }
  };

  return (
    <Card key={id} className="group relative max-w-none">
      <CardHeader>
        {detectedStatus !== "notChecked" ? (
          <>
            <div className="flex-between-center">
              {labelStatus[detectedStatus] && (
                <Label variant={labelStatus[detectedStatus]}>
                  {detectedStatus === "done" ? "검사완료" : "검사중"}
                </Label>
              )}
              <RepoBookmark repo={repositoryName} isBookmarked={favorite} />
            </div>
            <CardTitle size="big" className="leading-[2.45rem]">
              {repositoryName}
            </CardTitle>
          </>
        ) : (
          <div className="flex-between-center">
            <CardTitle size="big" className="leading-[2.45rem]">
              {repositoryName}
            </CardTitle>
            <RepoBookmark repo={repositoryName} isBookmarked={favorite} />
          </div>
        )}
      </CardHeader>
      <CardFooter>
        <Link
          prefetch
          href={`/repos/${repositoryName}`}
          className="basis-[9.153rem]"
        >
          <Button
            variant="filled"
            shape="rounded"
            className={cn(
              "flex-between-center h-12 w-full rounded-[0.875rem] p-[0.625rem]",
              detectedStatus === "done" && "bg-neutral-100",
            )}
            onClick={onClickRepo}
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
        </Link>
        <CardSubTitle className="items-end leading-none">
          {formatDatetimeToYYMMDD(createdAt)}
        </CardSubTitle>
      </CardFooter>
    </Card>
  );
}

export default memo(Repo);
