"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import envConfig from "@/config";

// Load ExcelViewer dynamically (client-side only)
const ExcelViewer = dynamic(() => import("@/components/Widget/ExcelViewer"), { ssr: false });

const FileWrap = ({ blog }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // ✅ Detect mobile safely
    const userAgent = navigator.userAgent || navigator.vendor;
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(userAgent));
  }, []);

  if (!blog?.file || blog.file.length === 0) return null; // ✅ Check for empty array

  const allowedIframeTypes = ["pdf"];

  return (
    <div className="file-wrap relative space-y-4">
      {blog.file.map((fileItem, index) => {
        const fileUrl = `${envConfig.NEXT_PUBLIC_API_ENDPOINT}${fileItem.path}`;
        const fileName = fileItem.path.replace("/uploads/file/", "");
        const fileExt = fileItem.path.split(".").pop()?.toLowerCase() || "";

        const iframeSrc = isMobile
          ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(fileUrl)}`
          : fileUrl;

        return (
          <div key={index} className=" max-w-[680px] w-full">
            {fileExt === "xlsx" ? (
              <ExcelViewer fileUrl={fileUrl} />
            ) : allowedIframeTypes.includes(fileExt) ? (
              <iframe
                src={iframeSrc}
                className="w-full border-none h-screen"
                style={{ overflow: "auto" }}
              ></iframe>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">File Name: {fileName}</span>
                <a
                  href={fileUrl}
                  download
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Download File
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FileWrap;
