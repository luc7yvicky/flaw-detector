import { RepoContentItem } from "@/types/repo";
import FileListItem from "./FileListItem";
import { useFileBookmarkStore } from "@/stores/useFileBookmarkStore.ts";
import { useMemo } from "react";

type BookmarkedFile = {
  name: string;
  path: string;
  type: "file";
  fileContentStatus: "initial";
  isBookmarked: true;
};

export default function FileList({
  structure,
  onToggle,
  depth = 0,
  username,
  repo,
  sortOption,
}: {
  structure: RepoContentItem[];
  onToggle: (item: RepoContentItem) => void;
  depth?: number;
  username: string;
  repo: string;
  sortOption?: "file" | "folder" | "bookmark";
}) {
  const fileBookmarks = useFileBookmarkStore((state) =>
    state.fileBookmarks.filter((bookmark) => bookmark.repoName === repo),
  );

  const bookmarkedFiles = useMemo(() => {
    return fileBookmarks.map((bookmark): BookmarkedFile => {
      const pathParts = bookmark.filePath.split("/");
      return {
        name: pathParts[pathParts.length - 1],
        path: bookmark.filePath,
        type: "file" as const,
        fileContentStatus: "initial",
        isBookmarked: true,
      };
    });
  }, [fileBookmarks]);

  const sortedStructure = useMemo(() => {
    return [...structure].sort((a, b) => {
      if (sortOption === "folder" || sortOption === "bookmark") {
        if (a.type === "dir" && b.type !== "dir") return -1;
        if (a.type !== "dir" && b.type === "dir") return 1;
      }
      if (sortOption === "file") {
        if (a.type === "file" && b.type !== "file") return -1;
        if (a.type !== "file" && b.type === "file") return 1;
      }
      return a.name.localeCompare(b.name);
    });
  }, [structure, sortOption]);

  return (
    <ul className="max-h-[calc(100dvh-12rem)] w-full overflow-x-hidden overflow-y-scroll scrollbar-hide">
      {sortOption === "bookmark" && (
        <>
          <li className="flex justify-between border-b border-line-default px-4 py-2 text-sm text-gray-500">
            <span>Bookmarks</span> <span>{bookmarkedFiles.length}</span>
          </li>
          {bookmarkedFiles.length > 0 ? (
            bookmarkedFiles.map((item) => (
              <FileListItem
                key={item.path}
                item={item}
                onToggle={onToggle}
                depth={0}
                username={username}
                repo={repo}
              />
            ))
          ) : (
            <li className="border-b border-line-default px-4 py-2 text-center text-sm text-gray-500">
              북마크된 파일이 없습니다.
            </li>
          )}

          {bookmarkedFiles.length > 0 && (
            <li className="border-b border-line-default px-4 py-2 text-sm text-gray-500">
              All Files
            </li>
          )}
        </>
      )}
      {sortedStructure.map((item) => (
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
