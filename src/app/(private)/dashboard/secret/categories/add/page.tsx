"use client";

import AddForm from "@/app/(private)/dashboard/secret/categories/add/add-form";
import { useRouter } from "next/navigation";
import categoryApiRequest from "@/apiRequests/category";
import { CategoryCreateType } from "@/schemaValidations/category.schema"; // Import the schema
import { z } from "zod";
import { toast } from "react-toastify";


export default function AddCategory() {
  const router = useRouter();

  const handleCreate = async (data: CategoryCreateType) => {
    try {
      const sessionToken = localStorage.getItem("sessionToken") || "";
      const result = await categoryApiRequest.createCategory(data, sessionToken);
      if (result.payload.success) {
        toast.success("Thành Công");
        router.push(`/dashboard/secret/categories/${result.payload.category._id}`);
      } else {
        toast.error("An error occurred during update. Please try again.");
        console.error("Error creating category:", result.payload.message);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An error occurred during update. Please try again.");
    }
  };
  return (
    <>
      <h1 className="text-2xl mb-4">Thêm Danh Mục</h1>
      <AddForm onSubmit={handleCreate} />
    </>
  );
}
