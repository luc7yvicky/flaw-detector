type FileType = 0 | 1; // 0: dir, 1: file

export type FolderItemProps = {
  isOpenDir?: boolean;
};

export type FileItemProps = {
  isBookmarked?: boolean;
  isSuccessful?: boolean;
  isChecked?: boolean;
} & PropsWithChildren;

export type FileTreeItemDemoProps = {
  type: FileType;
  depth: number;
  isHovered?: boolean;
} & FolderItem &
  FileItem;

export type FileStatus = "onCheck" | "onWait" | "error" | "success" | null;

export type FileResultProps = {
  id: string | number;
  name: string;
  vulnerability: string;
  severity: Critical | High | Medium | Low;
  descriptions: string[];
  modified_codes: string[];
  lines: string;
};

export type FileResultFailProps = {
  message: string;
};
