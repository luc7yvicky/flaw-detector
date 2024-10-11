import { cn } from "@/lib/utils";
import React from "react";
import { IconCaretLeft } from "./Icons";

export type PaginationProps = {
  className?: string;
  currentPage: number;
  totalPages: number;
  startPage?: number;
  endPage?: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  prefetchPage?: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  className,
  currentPage,
  totalPages,
  setCurrentPage,
  prefetchPage,
}) => {
  const maxPagesToShow = 10;

  const currentGroup = Math.floor((currentPage - 1) / maxPagesToShow);
  const startPage = currentGroup * maxPagesToShow + 1;
  const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  return (
    <div
      className={cn(
        "grid grid-flow-col gap-[0.813rem]",
        pages.length !== 1 && `grid-cols-${pages.length + 2}`,
        className,
      )}
    >
      {/* Render Previous Page button only if there's a previous page */}
      {currentPage > 1 ? (
        <button
          onClick={() => {
            setCurrentPage(currentPage - 1);
            window.scrollTo(0, 0);
          }}
          onMouseEnter={() => prefetchPage?.(currentPage - 1)}
          className="flex-center-center h-9 w-9 text-gray-dark"
          aria-label="Previous Page"
        >
          <IconCaretLeft className="fill-default h-6 w-6" />
        </button>
      ) : (
        currentPage < totalPages && <div className="w-8"></div>
      )}
      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => {
            setCurrentPage(page);
            window.scrollTo(0, 0);
          }}
          onMouseEnter={() => prefetchPage?.(page)}
          className={`${
            page === currentPage
              ? "rounded-full bg-bggray-light font-semibold text-gray-dark"
              : "text-gray-dark"
          } h-9 w-9 text-center text-[1rem] font-normal leading-6 tracking-[-0.011em]`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}
      {/* Render Next Page button only if there's a next page */}
      {currentPage < totalPages ? (
        <button
          onClick={() => {
            setCurrentPage(currentPage + 1);
            window.scrollTo(0, 0);
          }}
          onMouseEnter={() => prefetchPage?.(currentPage + 1)}
          className="flex-center-center h-9 w-9 text-gray-dark"
          aria-label="Next Page"
        >
          <IconCaretLeft className="fill-default h-6 w-6 rotate-180" />
        </button>
      ) : (
        currentPage > 1 && <div className="w-8"></div>
      )}
    </div>
  );
};

export default Pagination;
