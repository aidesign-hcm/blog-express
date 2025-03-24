"use client";

import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import blogApiRequest from "@/apiRequests/blog";
import { toast } from "react-toastify";
import envConfig from "@/config";
import { useRouter } from "next/navigation";
import Pagination from "@/components/widget/Pagination";
import { BlogCreateType } from "@/schemaValidations/blog.schema";

interface BlogTableProps {
  initialBlogs: any[];
  initialTotal: number;
  perPage: number;
}

export default function BlogTable() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 20;
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    console.log("Fetching blogs for page:", page);
    const fetchBlogs = async () => {
      const data = { page, perPage };
      try {
        const sessionToken = localStorage.getItem("sessionToken") || "";
        const resBlogs = await blogApiRequest.fetchBlogByUser(data, sessionToken) ;
        if (resBlogs) {
          const { total, posts: fetchedBlogs } = resBlogs.payload;
          setBlogs(fetchedBlogs);
          setTotalPages(Math.ceil(total / perPage));
        }
      } catch (error: any) {
        toast.error(
          "An error occurred while fetching categories. Please try again."
        );
      }
    };

    fetchBlogs();
  }, [page]);


  const columns = [
    {
      accessorKey: "featureImg",
      header: "Hình Ảnh",
      cell: ({ row }: any) => (
        <img
          src={
            row.original.featureImg?.path
              ? `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/${row.original.featureImg.path}`
              : "/path/to/placeholder.jpg"
          }
          className="w-8 h-8 object-cover rounded-md"
          alt="Feature Image"
        />
      ),
    },
    { accessorKey: "title", header: "Tên" },
    {
      accessorKey: "categories",
      header: "Danh mục",
      cell: ({ row }: any) =>
        row.original.categories[0]?.name ? row.original.categories[0].name : "Không có",
    },
    { accessorKey: "slug", header: "Đường dẫn" },
    {
      accessorKey: "createdAt",
      header: "Ngày đăng",
      cell: ({ row }: any) =>
        new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      header: "Hành động",
      cell: ({ row, rowIndex }: any) => {
        const router = useRouter();
        const handleEdit = () => {
          router.push(`/dashboard/account/blog/${row.original._id}`);
        };

        return (
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Edit
            </button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: blogs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full p-4">
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-200">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border border-gray-300 px-4 py-2"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border border-gray-300">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border border-gray-300 px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
