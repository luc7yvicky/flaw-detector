import { cn } from "@/lib/utils";
import React from "react";
import { IconCaretLeft } from "./Icons";

export type PaginationProps = {
  className?: string;
  currentPage: number;
  totalPages: number;
  startPage: number;
  endPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

const Pagination: React.FC<PaginationProps> = ({
  className,
  currentPage,
  totalPages,
  startPage,
  endPage,
  setCurrentPage,
}) => {
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  return (
    <div
      className={cn(
        "grid grid-flow-col grid-cols-12 gap-[0.625rem]",
        `grid-cols-${pages.length + 2}`,
        className,
      )}
    >
      {/* Render Previous Page button only if there's a previous page */}
      {currentPage > 1 ? (
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          className="text-center text-[1rem] font-normal leading-6 tracking-[-0.011em] text-gray-dark focus:outline-none"
          aria-label="Previous Page"
        >
          <IconCaretLeft className="fill-default" />
        </button>
      ) : (
        currentPage < totalPages && <div></div>
      )}
      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`${
            page === currentPage
              ? "font-semibold text-gray-dark"
              : "text-gray-dark"
          } h-9 w-9 text-center text-[1rem] font-normal leading-6 tracking-[-0.011em] focus:outline-none`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}
      {/* Render Next Page button only if there's a next page */}
      {currentPage < totalPages ? (
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          className="text-center text-[1rem] font-normal leading-6 tracking-[-0.011em] focus:outline-none"
          aria-label="Next Page"
        >
          <IconCaretLeft className="fill-default rotate-180" />
        </button>
      ) : (
        currentPage > 1 && <div className="w-8"></div>
      )}
    </div>
  );
};

export default Pagination;
