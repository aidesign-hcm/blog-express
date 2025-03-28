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
import { useRouter, useSearchParams  } from "next/navigation";
import Pagination from "@/components/widget/Pagination";
import { BlogCreateType, BlogCreate } from "@/schemaValidations/blog.schema"; // Import the schema
import Link from "next/link";
import SearchNormal from "@/components/Navigation/SearchSecret";



export default function BlogTable({ feature }: { feature: string }) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams();
  const router = useRouter();
  const userParam = searchParams.get("user") || "";
  const searchQuery = searchParams.get("q") || "";

  const [total, setTotal] = useState(0);

  const perPage = 20;
  const [totalPages, setTotalPages] = useState(1);


  const categorySlug = searchParams.get("cat") || null; 


  const fetchBlogs = async () => {
    const data: any = { page, perPage };
    if (userParam) data.user = userParam;
    if (searchQuery) data.q = searchQuery;
    if (categorySlug) {
      data.category = categorySlug; // Only include if it exists
    }

    try {
      const sessionToken = localStorage.getItem("sessionToken") || "";
      const resBlogs = await blogApiRequest.fetchAllBlog(data, sessionToken, feature);
      if (resBlogs) {
        const { total, posts: fetchedBlogs } = resBlogs.payload;
        setBlogs(fetchedBlogs);
        setTotalPages(Math.ceil(total / perPage));
        setTotal(total);
      }
    } catch (error: any) {
      toast.error(
        "An error occurred while fetching categories. Please try again."
      );
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page, userParam, searchQuery, categorySlug]);

  // Table columns
  const handleDelete = async (data: BlogCreateType, index: number) => {
    try {
      const sessionToken = localStorage.getItem("sessionToken") || "";
      const result = await blogApiRequest.deleteBlog(data, sessionToken);

      if (result.payload.success) {
        const updatedBlogs = [...blogs];
        updatedBlogs.splice(index, 1); // Remove the category at the specified index

        setBlogs(updatedBlogs); // Update the state with the new array

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

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? blogs.map((row) => row._id) : []);
  };

  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) return toast.warn("No items selected!");
    const sessionToken = localStorage.getItem("sessionToken") || "";
    try {
      const data = { ids: selectedRows };
      await blogApiRequest.bulkDelete( data, sessionToken );
      toast.success("Deleted successfully!");
      setSelectedRows([]); // Clear selection
      fetchBlogs(); 
    } catch (error) {
      toast.error("Failed to delete selected items.");
    }
  };

  const handleActivateSelected = async (status: boolean) => {
    if (selectedRows.length === 0) return toast.warn("No items selected!");
    const sessionToken = localStorage.getItem("sessionToken") || "";
    try {
      const data = { ids: selectedRows, isActive: status };
      await blogApiRequest.bulkActivate(data, sessionToken);
      toast.success("Activated successfully!");
      setSelectedRows([]); // Clear selection
      fetchBlogs(); // ✅ Fetch updated data after success
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
          checked={selectedRows.length === blogs.length && blogs.length > 0}
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
      accessorKey: "featureImg",
      header: "HA",
      cell: ({ row }: any) => (
        <img
          src={
            row.original.featureImg?.path
              ? `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/${row.original.featureImg.path}`
              : "/imagenotavailable.png"
          }
          className="w-8 h-8 object-cover rounded-md"
          alt="Feature Image"
        />
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
      accessorKey: "categories",
      header: "DM",
      cell: ({ row }: any) => {
        const categories = row.original.categories;
    
        return categories.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {categories.map((category: { name: string; slug: string }, index: number) => (
              <a
                key={index}
                href={`/dashboard/secret/blog?cat=${category.slug}`}
                className="badge bg-gray-200 text-gray-700 text-xs hover:bg-gray-300 transition"
              >
                {category.name}
              </a>
            ))}
          </div>
        ) : (
          <span className="text-gray-500 text-xs">Không có</span>
        );
      },
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
    data: blogs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <div className="w-full flex flex-col md:flex-row items-center justify-between mb-4">
        <span className="mb-2 block font-bold">Có {total} Bài viết</span>
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
            <tr key={headerGroup.id} className="bg-gray-100">
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
