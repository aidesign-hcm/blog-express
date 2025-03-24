"use client";
import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import userApiRequest from "@/apiRequests/user";
import { toast } from "react-toastify";

export default function LogTable({ params }: { params: { id: any } }) {
  const [logs, setLogs] = useState([]);
  const [user, setUser] = useState([]);
  const Id = params.id;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const sessionToken = localStorage.getItem("sessionToken") || "";
        const resUsers = await userApiRequest.fetchLogs(Id, sessionToken);

        if (resUsers && resUsers.payload.userLogs) {
          setLogs(resUsers.payload.userLogs);
          setUser(resUsers.payload.user); // ✅ Properly updating state
        } else {
          toast.error("No logs found for this user.");
        }
      } catch (error: any) {
        toast.error("An error occurred while fetching logs. Please try again.");
      }
    };

    fetchLogs();
  }, [Id]); // ✅ Added `Id` as a dependency

  const columns = [
    { accessorKey: "ip", header: "IP" },
    { accessorKey: "device", header: "Thiết bị" },
    { accessorKey: "location", header: "Vị trí" },
    {
      accessorKey: "loginTime",
      header: "Đăng nhập",
      cell: ({ row }: any) =>
        row.original.loginTime
          ? new Date(row.original.loginTime).toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false, // 24-hour format
            })
          : "N/A",
    },
    {
      accessorKey: "logoutTime",
      header: "Đăng xuất",
      cell: ({ row }: any) =>
        row.original.logoutTime
          ? new Date(row.original.logoutTime).toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false, // 24-hour format
            })
          : "Chưa đăng xuất",
    },
    
  ];

  const table = useReactTable({
    data: logs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <p className="font-bold mb-4">Thành Viên: {user.username}</p>
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
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border border-gray-300">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border border-gray-300 px-4 py-2"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center p-4">
                Không có lịch sử đăng nhập
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
