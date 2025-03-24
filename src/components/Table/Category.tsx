"use client";
import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import categoryApiRequest from "@/apiRequests/category";
import { toast } from "react-toastify";
import envConfig from "@/config";
import { useRouter } from "next/navigation";
import Pagination from "@/components/widget/Pagination";

export default function CategoryTable() {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 20;
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    const fetchCategories = async () => {
      const data = { page, perPage };
      try {
        const resCategories = await categoryApiRequest.fetchCategories(data);
        if (resCategories) {
          const { total, categories: fetchedCategories } =
            resCategories.payload;
          setCategories(fetchedCategories);
          setTotalPages(Math.ceil(total / perPage));
        }
      } catch (error: any) {
        toast.error(
          "An error occurred while fetching categories. Please try again."
        );
      }
    };

    fetchCategories();
  }, [page]);
  // Re-fetch categories if `page` changes

  // Table columns
  const handleDelete = async (data: CategoryFormValues, index: number) => {
    try {
      const sessionToken = localStorage.getItem("sessionToken") || "";
      const result = await categoryApiRequest.deleteCategory(data, sessionToken);
      
      if (result.payload.success) {
        // Create a new array without mutating the original `categories` state
        const updatedCategories = [...categories];
        updatedCategories.splice(index, 1); // Remove the category at the specified index
        
        setCategories(updatedCategories); // Update the state with the new array
        toast.success("Delete successful!");
      } else {
        console.error("Error deleting category:", result.message);
        toast.error("Error deleting category. Please try again.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An error occurred during deletion. Please try again.");
    }
  };
  

  const columns = [
    {
      accessorKey: "featureImg",
      header: "Hình Ảnh",
      cell: ({ row }: any) => (
        <img
          src={
            row.original.featureImg?.path
              ? `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/${row.original.featureImg.path}`
              : "/imagenotavailable.png"
          }
          className="w-12 h-12 object-cover rounded-md"
          alt="Feature Image"
        />
      ),
    },
    { accessorKey: "name", header: "Tên" },
    {
      accessorKey: "parent",
      header: "Danh mục cha",
      cell: ({ row }: any) =>
        row.original.parent?.name ? row.original.parent.name : "",
    },
    { accessorKey: "index", header: "Vị trí" },
    { accessorKey: "isFeature", header: "Nổi Bật" },
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
          router.push(`/dashboard/secret/categories/${row.original._id}`);
        };

        return (
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Edit
            </button>
            {/* Placeholder for Delete button */}
            <button onClick={() => handleDelete(row.original, row.index)} className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600">
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: categories,
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
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
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
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}
