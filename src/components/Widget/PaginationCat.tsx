"use client";
import Link from "next/link";
import React from "react";
import { ChevronLeft, ChevronRight } from "react-feather";

interface PaginationProps {
  page: number;
  perPage: number;
  total: number;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  perPage,
  total
}) => {
  const totalPages = Math.ceil(total / perPage);
  return (
    <>
      {totalPages > 1 ? (
        <div className="py-3 flex  space-x-2 items-center w-full justify-center content-center">
          {page > 1 ? (
            <>
              <Link
                href={`?page=${page > 1 ? page - 1 : 1}`}
                className="relative inline-flex items-center px-4 py-2 bg-white text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <ChevronLeft />
                Previous
              </Link>
              <Link
                href={`?page=${page > 1 ? page - 1 : 1}`}
                className="relative sm:inline-flex hidden items-center px-4 py-2 bg-white text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50"
              >
                {page - 1}
              </Link>
            </>
          ) : (
            ""
          )}

          <div className="bg-emerald-600 text-white relative inline-flex items-center px-4 py-2 text-sm rounded-lg font-medium">
            {page}
          </div>
          {page < totalPages ? (
            <>
              <Link
                href={`?page=${page < totalPages ? page + 1 : totalPages}`}
                className="relative sm:inline-flex hidden items-center px-4 py-2 bg-white text-sm rounded-lg font-medium text-gray-700 hover:bg-gray-50"
              >
                {page + 1}
              </Link>
              <Link
                href={`?page=${page < totalPages ? page + 1 : totalPages}`}
                className="relative inline-flex items-center px-4 py-2 bg-white text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Next
                <ChevronRight />
              </Link>
            </>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Pagination;
