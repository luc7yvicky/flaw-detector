import React from "react";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  startPage: number;
  endPage: number;
  onChangePage: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  startPage,
  endPage,
  onChangePage,
}) => {
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  return (
    <div className="flex items-center gap-[0.625rem]">
      {/* 이전 페이지로 이동 */}
      <button
        onClick={() => onChangePage(currentPage > 1 ? currentPage - 1 : 1)}
        className="text-center text-[1rem] font-normal leading-6 tracking-[-0.011em] text-gray-dark focus:outline-none"
        disabled={currentPage === 1}
      >
        &lt;
      </button>
      {/* 페이지를 클릭했을 때 */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onChangePage(page)}
          className={`${
            page === currentPage
              ? "font-semibold text-gray-dark"
              : "text-gray-dark"
          } h-9 w-9 text-center text-[1rem] font-normal leading-6 tracking-[-0.011em] focus:outline-none`}
        >
          {page}
        </button>
      ))}
      {/* 다음 페이지로 이동*/}
      <button
        onClick={() =>
          onChangePage(currentPage < totalPages ? currentPage + 1 : totalPages)
        }
        className="text-center text-[1rem] font-normal leading-6 tracking-[-0.011em] focus:outline-none"
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
