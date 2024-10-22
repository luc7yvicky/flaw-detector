import { cn } from "@/lib/utils";
import { Card, CardFooter, CardHeader, CardSubTitle } from "../ui/Card";
import React from "react";
import Button from "../ui/Button";

export const RepoSkeleton = ({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <Card
      className={cn(
        "pointer-events-none animate-pulse border-line-light",
        className,
      )}
      style={style}
    >
      <CardHeader>
        <div className="h-9 w-32 rounded-xl bg-gray-200" />
      </CardHeader>
      <CardFooter className="items-end">
        <div className="h-12 w-[9.153rem] rounded-[0.875rem] bg-gray-200" />
        <CardSubTitle className="h-[1.3rem] w-16 rounded-lg bg-gray-200" />
      </CardFooter>
    </Card>
  );
};

export const RepoListSkeleton = () => {
  const opacityLevels = [1, 0.5, 0.2];

  return (
    <div className="mb-[8.536rem] flex w-full min-w-[64rem] max-w-[82.125rem] flex-col gap-y-[7.75rem]">
      <div className="flex flex-col gap-y-7">
        {/* RepoFilterButton */}
        <section className="flex-between-center animate-pulse gap-x-[1.313rem]">
          <Button
            variant="outlined-gray"
            shape="rounded-xl"
            className="pointer-events-none h-[4.5rem] border-0 bg-gray-200"
          />
          <Button
            variant="outlined-gray"
            shape="rounded-xl"
            className="pointer-events-none h-[4.5rem] border-0 bg-gray-200"
          />
        </section>

        <section className="mt-5 flex flex-col gap-y-12">
          <div className="inline-flex h-11 animate-pulse items-center justify-between">
            {/* Title */}
            <h2 className="h-[3rem] w-[7.2rem] rounded-xl bg-gray-200" />

            {/* Filter */}
            <div className="inline-flex gap-x-[0.563rem]">
              <button className="h-[2.75rem] w-[5.563rem] cursor-default rounded-xl bg-gray-200" />
              <button className="h-[2.75rem] w-[5.563rem] cursor-default rounded-xl bg-gray-200" />
            </div>
          </div>

          {/* RepoList */}
          <div className="flex-between-center relative grid grid-cols-3 grid-rows-3 gap-x-6 gap-y-12 1150:grid-cols-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <RepoSkeleton
                key={index}
                style={{ opacity: opacityLevels[Math.floor(index / 4)] }}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
