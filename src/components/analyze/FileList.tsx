import { RepoContentItem } from "@/types/repo";
import FileListItem from "./FileListItem";

export default function FileList({
  structure,
  onToggle,
  depth = 0,
  username,
  repo,
}: {
  structure: RepoContentItem[];
  onToggle: (item: RepoContentItem) => void;
  depth?: number;
  username: string;
  repo: string;
}) {
  return (
    <ul className="max-h-[calc(100dvh-12rem)] overflow-y-scroll scrollbar-hide">
      {structure.map((item) => (
        <FileListItem
          key={item.path}
          item={item}
          onToggle={onToggle}
          depth={depth}
          username={username}
          repo={repo}
        />
      ))}
    </ul>
  );
}
