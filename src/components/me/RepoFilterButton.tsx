"use client";

import { useRepoListStore } from "@/stores/useRepoListStore";
import Button from "../ui/Button";
import { IconBookmarkFolder, IconClockCounterClockwise } from "../ui/Icons";

const buttonType = {
  bookmark: {
    icon: <IconBookmarkFolder />,
    text: "Bookmark",
  },
  "recent-files": {
    icon: <IconClockCounterClockwise />,
    text: "Recent File",
  },
};

export default function RepoFilterButton({
  type,
}: {
  type: "bookmark" | "recent-files";
}) {
  // recent file 용
  const filterByRecentClicked = useRepoListStore(
    (state) => state.filterByRecentClicked,
  );
  const setFilterByRecentClicked = useRepoListStore(
    (state) => state.setFilterByRecentClicked,
  );

  // bookmark 용
  const filterByBookmarked = useRepoListStore(
    (state) => state.filterByBookmarked,
  );
  const setFilterByBookmarked = useRepoListStore(
    (state) => state.setFilterByBookmarked,
  );

  const isActive =
    type === "bookmark" ? filterByBookmarked : filterByRecentClicked;

  const onClickFilter = () => {
    if (type === "bookmark") {
      setFilterByBookmarked(!filterByBookmarked);
    } else if (type === "recent-files") {
      setFilterByRecentClicked(!filterByRecentClicked);
    }
  };

  return (
    <Button
      variant="outlined-gray"
      shape="rounded-xl"
      className={isActive ? "bg-purple-dark" : ""}
      onClick={onClickFilter}
    >
      {buttonType[type].icon}
      <span>{buttonType[type].text}</span>
    </Button>
  );
}
