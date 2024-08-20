"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DetectedFile from "@/components/my/DetectedFile";
import Dropdown from "@/components/ui/Dropdown";
import { IconCaretLeft } from "@/components/ui/Icons";
import TitleBar from "@/components/ui/TitleBar";
import Button from "@/components/ui/Button";

const ITEMS_PER_PAGE = 12;
const dummyDetectedFiles = [
  { id: "1", label: "label", detectedAt: "23.10.01", filename: "file1.txt" },
  { id: "2", label: "label", detectedAt: "23.10.02", filename: "file2.txt" },
  { id: "3", label: "label", detectedAt: "23.10.03", filename: "file3.txt" },
  { id: "4", label: "label", detectedAt: "23.10.04", filename: "file4.txt" },
  { id: "5", label: "label", detectedAt: "23.10.05", filename: "file5.txt" },
  { id: "6", label: "label", detectedAt: "23.10.06", filename: "file6.txt" },
  { id: "7", label: "label", detectedAt: "23.10.07", filename: "file7.txt" },
  { id: "8", label: "label", detectedAt: "23.10.08", filename: "file8.txt" },
  { id: "9", label: "label", detectedAt: "23.10.09", filename: "file9.txt" },
  { id: "10", label: "label", detectedAt: "23.10.10", filename: "file10.txt" },
  { id: "11", label: "label", detectedAt: "23.10.11", filename: "file11.txt" },
  { id: "12", label: "label", detectedAt: "23.10.12", filename: "file12.txt" },
  { id: "13", label: "label", detectedAt: "23.10.13", filename: "file13.txt" },
];

export default function DetectedFilesPage() {
  const [currPage, setCurrPage] = useState<number>(1);
  const [lastPageIndex] = useState<number>(
    Math.ceil(dummyDetectedFiles.length / ITEMS_PER_PAGE),
  );
  const [detectedFiles, setDetectedFiles] = useState<any[]>([]);

  useEffect(() => {
    setDetectedFiles(
      dummyDetectedFiles.slice(
        (currPage - 1) * ITEMS_PER_PAGE,
        currPage * ITEMS_PER_PAGE,
      ),
    );
    // setLastPageIndex(Math.ceil(dummyDetectedFiles.length / ITEMS_PER_PAGE));
  }, [currPage]);

  return (
    <>
      <TitleBar
        title="Detected Files"
        align="center"
        className="mb-0 mt-[4.5rem]"
      />

      <section className="flex flex-col gap-y-12">
        <div className="inline-flex h-11 items-center justify-between">
          <h2 className="text-[2rem] font-medium -tracking-[0.01em] text-gray-dark">
            Library
          </h2>
          <div className="inline-flex gap-x-[0.563rem]">
            <Dropdown type="type" />
            <Dropdown type="sort" />
          </div>
        </div>

        <div className="relative grid grid-cols-4 grid-rows-3 gap-6">
          {detectedFiles.map((file, index) => (
            <Link href={file.id ? `/analyze/${file.id}` : "#"} key={index}>
              <DetectedFile {...file} />
            </Link>
          ))}

          {currPage > 1 && (
            <Button
              variant="navigation"
              shape="pill"
              className="-left-6"
              onClick={() => setCurrPage((prev) => Math.max(prev - 1, 0))}
              aria-label="Previous Page"
            >
              <IconCaretLeft className="fill-#343330" />
            </Button>
          )}

          {currPage < lastPageIndex && (
            <Button
              variant="navigation"
              shape="pill"
              className="-right-6"
              onClick={() =>
                setCurrPage((prev) => Math.min(prev + 1, lastPageIndex))
              }
              aria-label="Next Page"
            >
              <IconCaretLeft className="fill-#343330 rotate-180" />
            </Button>
          )}
        </div>
      </section>
    </>
  );
}
