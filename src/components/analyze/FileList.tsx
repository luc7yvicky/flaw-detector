"use client";

import { useState } from "react";
import FileListItem from "./FileListItem";

interface FileItem {
  id: string;
  type: "file" | "folder";
  name: string;
  status: "done" | "onProgress" | "onWait" | "error";
}

export default function FileList() {
  const [files] = useState<FileItem[]>([
    { id: "1", type: "folder", name: "src" , status:'done'},
    { id: "2", type: "file", name: "page.tsx", status: 'error'},
    { id: "3", type: "file", name: "page.tsx", status: 'onProgress'},
    { id: "4", type: "file", name: "page.tsx", status: 'onWait'},
  ]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedFiles(files.map((file) => file.id));
    } else {
      setSelectedFiles([]);
    }
  };

  const handleSelectFile = (id: string) => {
    setSelectedFiles((prev) =>
      prev.includes(id)
        ? prev.filter((fileId) => fileId !== id)
        : [...prev, id],
    );
  };

  return (
    <>
      <ul className="border-line-light block max-w-[247px] rounded-[12px] border text-gray-dark">
        {/* <FileListItem type="folder" name="src" />
        <FileListItem type="file" name="page.tsx" /> */}
        <li className="px-3 py-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedFiles.length === files.length}
              onChange={handleSelectAll}
              className="mr-4"
            />
            전체 선택
          </label>
        </li>
        {files.map((file) => (
          <FileListItem
            key={file.id}
            {...file}
            isSelected={selectedFiles.includes(file.id)}
            onSelect={() => handleSelectFile(file.id)}
          />
        ))}
      </ul>
    </>
  );
}
