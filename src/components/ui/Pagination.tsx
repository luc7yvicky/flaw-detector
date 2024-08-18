import React from "react";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-[0.625rem]">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`${
            page === currentPage
              ? "font-semibold text-gray-dark"
              : "text-gray-dark"
          } h-9 w-9 text-center text-[1rem] font-normal leading-6 tracking-[-0.011em] focus:outline-none`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        className={`${
          currentPage >= totalPages ? "text-gray-300" : "text-gray-dark"
        } text-center text-[1rem] font-normal leading-6 tracking-[-0.011em] focus:outline-none`}
        disabled={currentPage >= totalPages}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
