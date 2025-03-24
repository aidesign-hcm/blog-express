"use client";
import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import settingApiRequest from "@/apiRequests/common";
import { toast } from "react-toastify";
import envConfig from "@/config";
import { useRouter } from "next/navigation";
import Pagination from "@/components/widget/Pagination";

export default function MemuTable() {
  const [menus, setMenus] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 20;
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    const fetchUsers = async () => {
      const data = { page, perPage };
      try {
        const sessionToken = localStorage.getItem("sessionToken") || "";
        const resUsers = await settingApiRequest.fetchMenus(data, sessionToken);
        if (resUsers) {
          const { total, menus } =
          resUsers.payload;
          setMenus(menus);
          setTotalPages(Math.ceil(total / perPage));
        }
      } catch (error: any) {
        toast.error(
          "An error occurred while fetching categories. Please try again."
        );
      }
    };

    fetchUsers();
  }, [page]);
  const handleDelete = async (data: any, index: number) => {
    try {
      const sessionToken = localStorage.getItem("sessionToken") || "";
      const result = await settingApiRequest.deleteMenu(data, sessionToken);
      
      if (result.payload.success) {
        // Create a new array without mutating the original `categories` state
        const updatedMenu = [...menus];
        updatedMenu.splice(index, 1); // Remove the category at the specified index
        
        setMenus(updatedMenu); // Update the state with the new array
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
    { accessorKey: "title", header: "Tên" },
    { accessorKey: "position", header: "Vị trí" },
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
          router.push(`/dashboard/secret/menu/${row.original._id}`);
        };

        return (
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Chỉnh sửa
            </button>
            {/* Placeholder for Delete button */}
            <button onClick={() => handleDelete(row.original, row.index)} className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600">
              Xóa
            </button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: menus,
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
