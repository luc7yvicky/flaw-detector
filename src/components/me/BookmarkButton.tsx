"use client";

import { useRepoListStore } from "@/stores/useRepoListStore";
import Button from "../ui/Button";
import { IconBookmarkFolder } from "../ui/Icons";

export default function BookmarkButton() {
  const filterByBookmarked = useRepoListStore(
    (state) => state.filterByBookmarked,
  );
  const setFilterByBookmarked = useRepoListStore(
    (state) => state.setFilterByBookmarked,
  );

  return (
    <Button
      variant="outlined-gray"
      shape="rounded-xl"
      onClick={() => setFilterByBookmarked(!filterByBookmarked)}
    >
      <IconBookmarkFolder />
      <span>Bookmark</span>
    </Button>
  );
}
