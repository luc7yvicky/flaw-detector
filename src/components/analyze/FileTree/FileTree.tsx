import { RepoTree } from "@/lib/api/repositories";
import { useFileBookmarkStore } from "@/stores/useFileBookmarkStore";
import React, { useMemo } from "react";
import FileTreeItem from "./FileTreeItem";

type FileTreeProps = {
  data: RepoTree;
  repo: string;
  sortOption?: "file" | "folder" | "bookmark";
};

type BookmarkedFile = {
  name: string;
  path: string;
  size?: number;
  type: "file";
  fileContentStatus: "initial";
  isBookmarked: true;
};

function FileTree({ data, repo, sortOption }: FileTreeProps) {
  const rootItems = data.tree.filter((item) => !item.path.includes("/"));

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

  const sortedItems = useMemo(() => {
    return [...rootItems].sort((a, b) => {
      if (sortOption === "folder" || sortOption === "bookmark") {
        // 폴더 우선 정렬
        if (a.type === "dir" && b.type !== "dir") return -1;
        if (a.type !== "dir" && b.type === "dir") return 1;
      } else if (sortOption === "file") {
        // 파일 우선 정렬
        if (a.type !== "dir" && b.type === "dir") return -1;
        if (a.type === "dir" && b.type !== "dir") return 1;
      }

      // 이름순 정렬
      return a.name.localeCompare(b.name);
    });
  }, [rootItems, sortOption]);

  return (
    <ul className="">
      {sortOption === "bookmark" && (
        <>
          <li className="flex justify-between border-b border-line-default px-4 py-2 text-sm text-gray-500">
            <span>Bookmarks</span> <span>{bookmarkedFiles.length}</span>
          </li>
          {bookmarkedFiles.length > 0 ? (
            bookmarkedFiles.map((item) => (
              <FileTreeItem
                key={item.path}
                item={item}
                level={0}
                allItems={data.tree}
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
      {sortedItems.map((item) => (
        <FileTreeItem
          key={item.path}
          item={item}
          level={0}
          allItems={data.tree}
          repo={repo}
        />
      ))}
    </ul>
  );
}

export default React.memo(FileTree);
