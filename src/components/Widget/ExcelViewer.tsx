"use client";

import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const ExcelViewer = ({ fileUrl }: { fileUrl: string }) => {
  const [data, setData] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [maxWidth, setMaxWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!fileUrl) return;

    const fetchExcel = async () => {
      try {
        setLoading(true);

        // Fetch file as blob (use `no-cors` if needed)
        const response = await fetch(
          "http://localhost:8000/uploads/file/1739284499368-data.xlsx",
          { mode: "cors" }
        );
        if (!response.ok) throw new Error("Failed to fetch file");

        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        // Get first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON array
        const jsonData: string[][] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1, // Get rows as arrays
        });

        setData(jsonData);
      } catch (error) {
        console.error("Error loading Excel file:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExcel();
  }, [fileUrl]);

  useEffect(() => {
    const updateMaxWidth = () => {
      const contentWrapper = document.querySelector(".content-wrapper");
      if (contentWrapper) {
        setMaxWidth(contentWrapper.clientWidth);
      }
    };

    updateMaxWidth();
    window.addEventListener("resize", updateMaxWidth);
    return () => window.removeEventListener("resize", updateMaxWidth);
  }, []);

  return (
    <div className="w-full my-4 overflow-x-hidden" style={{ maxWidth: maxWidth ? `${maxWidth}px` : "100%" }}>
      {loading ? (
        <p>Loading Excel file...</p>
      ) : data.length > 0 ? (
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                {data[0].map((cell, index) => (
                  <th key={index} className="border border-gray-300 p-2">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-100">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border border-gray-300 p-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No data found in Excel file.</p>
      )}
    </div>
  );
};

export default ExcelViewer;
