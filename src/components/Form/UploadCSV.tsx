"use client";
import { useState } from "react";
import Papa from "papaparse";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import userApiRequest from "@/apiRequests/user";

const UploadCSV = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [failCount, setFailCount] = useState(0);
  const [uploadResults, setUploadResults] = useState<any[]>([]);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setFile(event.target.files[0]);
    }
  };

  // Parse CSV and limit rows to 100
  const parseCSV = () => {
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.data.length === 0) {
          toast.error("No valid data found in the file!");
          return;
        }

        let validData: any[] = [];
        let invalidCount = 0;

        result.data.forEach((row: any) => {
          if (row.username && row.email  && row.password) {
            if (validData.length < 100) validData.push(row); // Limit 100 items
          } else {
            invalidCount++;
          }
        });

        setData(validData);
        setSuccessCount(0);
        setFailCount(invalidCount);
        setUploadResults([]); // Reset previous results

        toast.success(`Phân tích: ${validData.length} hợp lệ, ${invalidCount} không hợp lệ`);
      },
      error: () => {
        toast.error("Failed to parse CSV file!");
      },
    });
  };

  // Upload with a 2-second delay per request
  const uploadToServer = async () => {
    if (data.length === 0) {
      toast.warn("No data to upload!");
      return;
    }
  
    setUploading(true);
    setUploadResults([]);
    setSuccessCount(0);
    setFailCount(0);
  
    let uploaded = 0;
    let failed = 0;
    const limit = Math.min(data.length, 100); // Limit to 100 items
  
    for (let i = 0; i < limit; i++) {
      let statusMessage = "";
  
      try {
        const sessionToken = localStorage.getItem("sessionToken") || "";
        const result = await userApiRequest.CreateUser(data[i], sessionToken);
        if (result.payload.success) {
          uploaded++;
          statusMessage = "Success";
        } else {
          failed++;
          statusMessage = `Error: ${result.payload.message || "Unknown error"}`;
        }
      } catch (error) {
        failed++;
        statusMessage = error.payload.message;
      }
  
      // Update success/fail counts
      setSuccessCount(uploaded);
      setFailCount(failed);
      setProgress(Math.round(((i + 1) / limit) * 100));
  
      // Push result live into the table
      setUploadResults((prev) => [...prev, { ...data[i], status: statusMessage }]);
  
      // Wait 2 seconds before the next request
      if (i < limit - 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  
    setUploading(false);
    toast.success("Import completed!"); // Show final message when done
  };
  

  return (
    <>
      <div className="mt-4 p-4 border rounded border-dashed">
        <input type="file" accept=".csv" onChange={handleFileChange} />
      </div>
      <div className="my-4 flex gap-4">
        <button className="btn btn-md" onClick={parseCSV} disabled={!file}>
          Kiểm tra File
        </button>
        <button
          className="btn btn-md btn-primary"
          onClick={uploadToServer}
          disabled={uploading || data.length === 0}
        >
          {uploading ? `Đang tải... ${progress}%` : "Import Dữ Liệu"}
        </button>
      </div>

      {/* Summary Live Updates */}
      {(successCount + failCount > 0 || uploadResults.length > 0) && (
        <div className="mt-4 border p-4 rounded bg-gray-100">
          <h2 className="text-lg font-semibold mb-2">Kết quả Import</h2>
          <p>
            Dữ liệu thành công:{" "}
            <span className="text-green-600 font-bold">{successCount}</span>
          </p>
          <p>
            Dữ liệu lỗi:{" "}
            <span className="text-red-600 font-bold">{failCount}</span>
          </p>
          <p>
            Tiến độ:{" "}
            <span className="text-blue-600 font-bold">{progress}%</span>
          </p>
        </div>
      )}

      {/* Live Updating Table */}
      {uploadResults.length > 0 && (
        <div className="mt-6">
          <table className="table-auto w-full border border-collapse mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2 py-1">Username</th>
                <th className="border px-2 py-1">Email</th>
                <th className="border px-2 py-1">Phone Number</th>
                <th className="border px-2 py-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {uploadResults.map((row, index) => (
                <tr key={index} className="border">
                  <td className="border px-2 py-1">{row.username}</td>
                  <td className="border px-2 py-1">{row.email}</td>
                  <td className="border px-2 py-1">{row.phonenumber}</td>
                  <td
                    className={`border px-2 py-1 ${
                      row.status.includes("Success")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {row.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default UploadCSV;
