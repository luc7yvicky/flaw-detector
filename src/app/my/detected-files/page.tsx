"use client";

import DetectedFile from "@/components/analyze/DetectedFile";
import Dropdown from "@/components/ui/Dropdown";
import { IconCaretLeft } from "@/components/ui/Icons";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 12;
const dummyDetectedFiles = [
  { label: "label", detectedAt: "23.10.01", filename: "file1.txt" },
  { label: "label", detectedAt: "23.10.02", filename: "file2.txt" },
  { label: "label", detectedAt: "23.10.03", filename: "file3.txt" },
  { label: "label", detectedAt: "23.10.04", filename: "file4.txt" },
  { label: "label", detectedAt: "23.10.05", filename: "file5.txt" },
  { label: "label", detectedAt: "23.10.06", filename: "file6.txt" },
  { label: "label", detectedAt: "23.10.07", filename: "file7.txt" },
  { label: "label", detectedAt: "23.10.08", filename: "file8.txt" },
  { label: "label", detectedAt: "23.10.09", filename: "file9.txt" },
  { label: "label", detectedAt: "23.10.10", filename: "file10.txt" },
  { label: "label", detectedAt: "23.10.11", filename: "file11.txt" },
  { label: "label", detectedAt: "23.10.12", filename: "file12.txt" },
  { label: "label", detectedAt: "23.10.13", filename: "file13.txt" },
];

export default function DetectedFiles() {
  const [currPage, setCurrPage] = useState<number>(1);
  const [lastPageIndex, setLastPageIndex] = useState<number>(
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
      <h1 className="flex-col-center-center mt-[4.5rem] gap-y-5 text-[2.5rem] font-normal leading-[3.026rem] -tracking-[0.01em] text-primary-500">
        <span className="rounded-full border-[0.25rem] border-primary-500 px-[1.25rem] py-[0.969rem]">
          Detected Files
        </span>
      </h1>

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

        <div className="flex-between-center relative grid grid-cols-4 gap-x-6 gap-y-12">
          {detectedFiles.map((file, index) => (
            <DetectedFile key={index} {...file} />
          ))}

          {/* 임시, Button */}
          {currPage > 1 && (
            <button
              className="flex-center-center absolute -left-6 bottom-[47%] h-[3.25rem] w-[3.25rem] rounded-[50%] border border-gray-dark bg-white"
              onClick={() => setCurrPage((prev) => Math.max(prev - 1, 0))}
            >
              <IconCaretLeft className="fill-#343330" />
            </button>
          )}
          {currPage < lastPageIndex && (
            <button
              className="flex-center-center absolute -right-6 bottom-[47%] h-[3.25rem] w-[3.25rem] rounded-[50%] border border-gray-dark bg-white"
              onClick={() =>
                setCurrPage((prev) => Math.min(prev + 1, lastPageIndex))
              }
            >
              <IconCaretLeft className="fill-#343330 rotate-180" />
            </button>
          )}
        </div>
      </section>
    </>
  );
}
