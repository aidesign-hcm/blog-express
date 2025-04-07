"use client";

import mediaApiRequest from "@/apiRequests/media";
import React, { useState } from "react";
import envConfig from "@/config";

interface VideoUploaderProps {
  onUrlChange: (url: string) => void; // Function to pass URL back to parent component
}

export default function VideoUploader({ onUrlChange }: VideoUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<boolean>(false); // For progress tracking
  const [message, setMessage] = useState<string | null>(null);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) return;

    const sessionToken = localStorage.getItem("sessionToken") || "";
    const formData = new FormData();
    formData.append("video", file);

    try {
      setProgress(true)
      // Make the upload request
      const response = await mediaApiRequest.postVideo(
        formData,
        sessionToken
      );

   

      // Generate the video URL
      const baseUrl = envConfig?.NEXT_PUBLIC_API_ENDPOINT || "";
      const videoUrl = baseUrl + "/api/video/stream/" + response.payload.videoId;

      // Pass the video URL to the parent component
      onUrlChange(videoUrl);

      setMessage("Upload successful!");
      setProgress(false)
    } catch (error: any) {
      setProgress(false)
      setMessage(
        "Upload failed: " + (error.response?.data?.message || error.message)
      );
    } 
  };

  return (
    <div className="border p-4 rounded mt-4">
      <span className="block mb-2 font-bold">Đăng Video</span>
      
      {/* Accept .mkv file format */}
      <input
        type="file"
        accept=".mkv,video/*" // Allow .mkv files and other video formats
        onChange={handleFileChange}
        className="mb-2"
      />
      
      <span
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
      >
        Upload
      </span>
      {/* Show progress bar while uploading */}
      {progress && (
        <div className="mt-2">
          <progress className="progress w-56"></progress>
        </div>
      )}

      {/* Show success or error message */}
      {message && <div className="mt-2 text-green-600">{message}</div>}
    </div>
  );
}
