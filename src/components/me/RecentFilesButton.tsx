"use client";

import { useRepoListStore } from "@/stores/useRepoListStore";
import Button from "../ui/Button";
import { IconClockCounterClockwise } from "../ui/Icons";

export default function RecentFilesButton() {
  const filterByRecentClicked = useRepoListStore(
    (state) => state.filterByRecentClicked,
  );
  const setFilterByRecentClicked = useRepoListStore(
    (state) => state.setFilterByRecentClicked,
  );

  return (
    <Button
      variant="outlined-gray"
      shape="rounded-xl"
      onClick={() => setFilterByRecentClicked(!filterByRecentClicked)}
    >
      <IconClockCounterClockwise />
      <span>Recent File</span>
    </Button>
  );
}
