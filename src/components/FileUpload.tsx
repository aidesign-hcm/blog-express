"use client";
import { useState , useEffect } from "react";
import { Upload, X } from "react-feather";
type FileUploadProps = {
  serverImageUrl?: string; // Initial image URL from the server
  onUploadFeatureImg: (imageFile: File) => Promise<string>; // Upload image and return server URL
  onDeleteFeatureImg: () => void; // Handle deleting the feature image
};
import { getImageUrl } from "@/utils/getImageUrl";

const FileUpload = ({ serverImageUrl, onUploadFeatureImg, onDeleteFeatureImg }: FileUploadProps) => {
  const [errorText, setErrorText] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string | null>(serverImageUrl || "");

  const maxSize = 4024; // Max size in KB

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileSizeMB = file.size / maxSize / maxSize;

    if (!file.type.match("image.*")) {
      setErrorText("Please choose an image file");
      return;
    }
    setUploading(true);
    setErrorText("");

    if (fileSizeMB > 1) {
      setErrorText("Your file is too big! Please select an image under 1MB");
      return;
    }

    const imageURL = URL.createObjectURL(file);
    setFileName(file.name);
    setFileUrl(imageURL);
    setErrorText("");

    // Call the function to upload the image
    onUploadFeatureImg(file);
  };

  const handleRemove = () => {
    // Clear the local state
    setFileName("");
    setFileUrl("");
    setErrorText("");

    // Notify parent component
    onDeleteFeatureImg();
  };
  useEffect(() => {
    // Generate full URL for the server image
    if (serverImageUrl) {
      const fullUrl = getImageUrl(serverImageUrl);
      setFileUrl(fullUrl);
    }
  }, [serverImageUrl]);

  return (
    <div className="w-full block mb-2">
      <label className="flex flex-col px-4 py-6 border-dashed text-center border border-gray-400 cursor-pointer">
        <input
          className="hidden"
          type="file"
          accept="image/png, image/jpeg, image/bmp, image/gif"
          onChange={handleFileChange}
        />
        <span className="text-center block">
          <span className="flex justify-center">
            <Upload />
          </span>
          <span className="file-label">Tải ảnh lên...</span>
        </span>
        {fileName && <span className="mt-2 text-sm">Đã chọn: {fileName}</span>}
        {errorText && <span className="text-red-500 mt-2">{errorText}</span>}
      </label>
      {fileUrl && (
        <div className="relative">
        <div className="mt-4">
          <img src={fileUrl} alt="Preview" className="max-w-full h-auto rounded" />
        </div>
        <button
        type="button"
        onClick={handleRemove}
        className="mt-4 text-sm text-red-600 hover:underline absolute right-2 top-2"
      >
        <X />
      </button>
      </div>
      )}
    </div>
  );
};

export default FileUpload;
