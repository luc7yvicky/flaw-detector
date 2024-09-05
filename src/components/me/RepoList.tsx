"use client";

import { useState } from "react";
import Repo from "@/components/me/Repo";
import { IconCaretLeft } from "@/components/ui/Icons";
import { RepoListData } from "@/types/type";

const ITEMS_PER_PAGE = 12;

export default function RepoList({
  initialRepos,
}: {
  initialRepos: RepoListData[];
}) {
  const [currPage, setCurrPage] = useState(1);
  const [repos] = useState<RepoListData[]>(initialRepos);

  const totalPages = Math.ceil(repos.length / ITEMS_PER_PAGE);
  const startIndex = (currPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRepos = repos.slice(startIndex, endIndex);

  return (
    <div className="flex-between-center relative grid grid-cols-4 grid-rows-3 gap-x-6 gap-y-12">
      {currentRepos.map((repo) => (
        <Repo key={repo.repositoryName} {...repo} />
      ))}

      {currPage > 1 && (
        <button
          className="flex-center-center absolute -left-6 bottom-[47%] h-[3.25rem] w-[3.25rem] rounded-[50%] border border-gray-dark bg-white"
          onClick={() => setCurrPage((prev) => Math.max(prev - 1, 1))}
        >
          <IconCaretLeft className="fill-#343330" />
        </button>
      )}
      {currPage < totalPages && (
        <button
          className="flex-center-center absolute -right-6 bottom-[47%] h-[3.25rem] w-[3.25rem] rounded-[50%] border border-gray-dark bg-white"
          onClick={() => setCurrPage((prev) => Math.min(prev + 1, totalPages))}
        >
          <IconCaretLeft className="fill-#343330 rotate-180" />
        </button>
      )}
    </div>
  );
}
