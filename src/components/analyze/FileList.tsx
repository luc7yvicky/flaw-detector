import { RepoContentItem } from "@/types/type";
import FileListItem from "./FileListItem";

export default function FileList({
  structure,
  onToggle,
  isNested = false,
  username,
  repo,
}: {
  structure: RepoContentItem[];
  onToggle: (item: RepoContentItem) => void;
  isNested: boolean;
  username: string;
  repo: string;
}) {
  return (
    <ul className="scrollbar-hide max-h-[calc(100dvh-12rem)] overflow-y-scroll">
      {structure.map((item) => (
        <FileListItem
          key={item.path}
          item={item}
          onToggle={onToggle}
          isNested={isNested}
          username={username}
          repo={repo}
        />
      ))}
    </ul>
  );
}
