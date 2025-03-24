import React from "react";

interface PaginationProps {
  currentPage: number; // Current page number
  totalPages: number; // Total pages
  onPageChange: (page: number) => void; // Callback for page change
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex justify-between items-center mt-4">
      <button
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span>
        Page {currentPage} / {totalPages}
      </span>
      <button
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}
