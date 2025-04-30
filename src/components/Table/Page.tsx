"use client";
import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import pageApiRequest from "@/apiRequests/page";
import { toast } from "react-toastify";
import { useRouter, useSearchParams  } from "next/navigation";
import Pagination from "@/components/widget/Pagination";
import { PageCreateType } from "@/schemaValidations/page.schema"; // Import the schema
import Link from "next/link";
import SearchNormal from "@/components/Navigation/SearchSecret";



export default function PageTable({ feature }: { feature: string }) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [pages, setPages] = useState([]);
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams();
  const userParam = searchParams.get("user") || "";
  const searchQuery = searchParams.get("q") || "";

  const [total, setTotal] = useState(0);

  const perPage = 20;
  const [totalPages, setTotalPages] = useState(1);

  const fetchPages = async () => {
    const data: any = { page, perPage };
    if (userParam) data.user = userParam;
    if (searchQuery) data.q = searchQuery;

    try {
      const sessionToken = localStorage.getItem("sessionToken") || "";
      const resPages = await pageApiRequest.fetchAllPage(data, sessionToken, feature);
      if (resPages) {
        const { total, pages: fetchedBlogs } = resPages.payload;
        setPages(fetchedBlogs);
        setTotalPages(Math.ceil(total / perPage));
        setTotal(total);
      }
    } catch (error: any) {
      toast.error(
        "An error occurred while fetching. Please try again."
      );
    }
  };

  useEffect(() => {
    fetchPages();
  }, [page, userParam, searchQuery]);

  // Table columns
  const handleDelete = async (data: PageCreateType, index: number) => {
    try {
      const sessionToken = localStorage.getItem("sessionToken") || "";
      const result = await pageApiRequest.deletePage(data, sessionToken);

      if (result.payload.success) {
        const updatedPages = [...pages];
        updatedPages.splice(index, 1); // Remove the category at the specified index

        setPages(updatedPages); // Update the state with the new array

        toast.success("Delete successful!");
      } else {
        console.error("Error deleting category:", result.message);
        toast.error("Error deleting. Please try again.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An error occurred during deletion. Please try again.");
    }
  };

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? pages.map((row) => row._id) : []);
  };

  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) return toast.warn("No items selected!");
    const sessionToken = localStorage.getItem("sessionToken") || "";
    try {
      const data = { ids: selectedRows };
      await pageApiRequest.bulkDelete( data, sessionToken );
      toast.success("Deleted successfully!");
      setSelectedRows([]); // Clear selection
      fetchPages(); 
    } catch (error) {
      toast.error("Failed to delete selected items.");
    }
  };

  const handleActivateSelected = async (status: boolean) => {
    if (selectedRows.length === 0) return toast.warn("No items selected!");
    const sessionToken = localStorage.getItem("sessionToken") || "";
    try {
      const data = { ids: selectedRows, isActive: status };
      await pageApiRequest.bulkActivate(data, sessionToken);
      toast.success("Activated successfully!");
      setSelectedRows([]); // Clear selection
      fetchPages(); // ✅ Fetch updated data after success
    } catch (error) {
      toast.error("Failed to activate selected items.");
    }
  };
  

  const columns = [
    {
      accessorKey: "select",
      header: (
        <input
          type="checkbox"
          onChange={(e) => toggleSelectAll(e.target.checked)}
          checked={selectedRows.length === pages.length && pages.length > 0}
        />
      ),
      cell: ({ row }: any) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row.original._id)}
          onChange={() => toggleRowSelection(row.original._id)}
        />
      ),
    },
    {
      accessorKey: "isActive",
      header: "TT",
      cell: ({ row }: any) => {
        const status = row.original.isActive;
        let tooltip = "Chưa duyệt";
        let dotColor = "bg-gray-400"; // Default color for "Chưa duyệt"
    
        if (status === true) {
          tooltip = "Công khai";
          dotColor = "bg-green-500"; // Green for "Công khai"
        } else if (status === false) {
          tooltip = "Đang khóa";
          dotColor = "bg-gray-500"; // Gray for "Đang khóa"
        }
    
        return (
          <div className="tooltip" data-tip={tooltip}>
            <span className={`w-3 h-3 rounded-full ${dotColor} block`}></span>
          </div>
        );
      },
    },
    {
      accessorKey: "index",
      header: "",
      cell: ({ row }: any) => (
        <span className="text-small text-gray-600">{row.original.index}</span>
      ),
    },


    {
      accessorKey: "title",
      header: "Tên",
      cell: ({ row }: any) => (
        <span className="line-clamp-1">{row.original.title}</span>
      ),
    },  
    {
      accessorKey: "user",
      header: "Thành Viên",
      cell: ({ row }: any) => {
        const user = row.original.user;
        return user ? (
          <Link
            href={`/dashboard/secret/user/${user._id}`} // Adjust URL based on your routing
            className="text-blue-500 hover:underline text-xs px-1 rounded border"
          >
            {user.username}
          </Link>
        ) : (
          "Không có"
        );
      },
    },

    {
      accessorKey: "createdAt",
      header: "Ngày",
      cell: ({ row }: any) =>
        new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      header: "Hành động",
      cell: ({ row, rowIndex }: any) => {
        const router = useRouter();
        const handleEdit = () => {
          router.push(`/dashboard/secret/blog/${row.original._id}`);
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
            <button
              onClick={() => handleDelete(row.original, row.index)}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: pages,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <div className="w-full flex flex-col md:flex-row items-center justify-between mb-4">
        <span className="mb-2 block font-bold">Có {total} trang</span>
        <SearchNormal />
      </div>
      {selectedRows.length > 0 && (
        <div className="flex flex-wrap items-center justify-between mb-2 bg-white border p-2 rounded">
          <div className="flex-start">{selectedRows.length} sản phẩm được chọn</div>
          <div className="flex-end">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn m-1 btn-sm btn-outline normal-case">
                Hành động
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-36 text-sm"
              >
                <li>
                  <span onClick={() => handleActivateSelected(false)}>Ẩn</span>
                </li>
                <li>
                  <span onClick={() => handleActivateSelected(true)}>Hiển thị</span>
                </li>
                <li>
                  <span onClick={() => handleDeleteSelected()}>Xoá</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-100 text-left">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-2 py-2"
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
            <tr
              key={row.id}
              className="border border-gray-300  even:bg-gray-100"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-2 py-2">
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
