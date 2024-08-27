import { RepoItem } from "@/types/type";
import FileListItem from "./FileListItem";
import { cn } from "@/lib/utils";

export default function FileList({
  structure,
  onToggle,
  isNested = false,
}: {
  structure: RepoItem[];
  onToggle: (item: RepoItem) => void;
  isNested: boolean;
}) {
  return (
    <ul >
      {structure.map((item) => (
        <FileListItem
          key={item.path}
          item={item}
          onToggle={onToggle}
          isNested={isNested}
        />
      ))}
    </ul>
  );
}
