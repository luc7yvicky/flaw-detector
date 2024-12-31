"use client";

import { useEffect, useState } from "react";
import { Ranking } from "../../ui/Ranking";
import { getSearchKeywords } from "../../../lib/api/ranking";
import { useQuery } from "@tanstack/react-query";

type SearchKeyword = {
  keyword: string;
  searchCounts: number;
};

export default function RealTimeTopic() {
  const {
    data: searchKeywords = [],
    refetch,
    isLoading,
  } = useQuery<SearchKeyword[]>({
    queryKey: ["searchKeywords"],
    queryFn: getSearchKeywords,
    refetchInterval: false,
    enabled: true,
  });
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>("");

  useEffect(() => {
    const updateLastUpdatedTime = () => {
      const currentTime = new Date();
      const month = (currentTime.getMonth() + 1).toString().padStart(2, "0");
      const date = currentTime.getDate().toString().padStart(2, "0");
      const hours = currentTime.getHours().toString().padStart(2, "0");
      setLastUpdatedTime(`${month}.${date} ${hours}:00시 기준`);
    };

    updateLastUpdatedTime();

    const now = new Date();
    const millisecondsUntilNextHour =
      ((60 - now.getMinutes()) * 60 - now.getSeconds()) * 1000;

    const timeoutId = setTimeout(() => {
      refetch();
      updateLastUpdatedTime();
    }, millisecondsUntilNextHour);

    return () => clearTimeout(timeoutId);
  }, [refetch]);

  return (
    <section className="w-full max-w-[22rem]">
      <h2 className="mb-[17px] text-2xl font-semibold leading-[1.816rem] tracking-[-0.01em]">
        실시간 Topic
      </h2>
      {isLoading ? (
        <div className="h-[1.375rem] w-36 animate-pulse rounded bg-gray-200"></div>
      ) : (
        <p className="text-lg font-medium leading-[1.361rem] tracking-[-0.01em] text-[#767676]">
          {lastUpdatedTime}
        </p>
      )}
      <Ranking topSearchKeywords={searchKeywords} />
    </section>
  );
}
