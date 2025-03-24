"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AddForm from "@/app/(private)/dashboard/secret/categories/add/add-form";
import { CategoryRes, CategoryCreate } from "@/schemaValidations/category.schema"; // Import the schema
import categoryApiRequest from "@/apiRequests/category";
import { toast } from "react-toastify";
import { z } from "zod";

type CategoryFormValues = z.infer<typeof CategoryCreate>[0];

export default function EditCategory({ params }: { params: { id: any } }) {
  const [category, setCategory] = useState<CategoryFormValues | null>(null);
  const categoryId = params.id;
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const result = await categoryApiRequest.fetchCategoryById(categoryId);

        if (result.payload.success) {
          setCategory(result.payload.category);
        } else {
          console.error("Error fetching category:", result.message);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  const handleUpdate = async (data: CategoryFormValues) => {
    try {
      const sessionToken = localStorage.getItem("sessionToken") || "";
      const result = await categoryApiRequest.updateCategory( data, sessionToken );
      
      if (result.payload.success) {
        setCategory(result.payload.category);
        toast.success("Update successful!");
      } else {
        console.error("Error updating category:", result.message);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An error occurred during update. Please try again.");
    }
  };

  return (
    <>
      <h1 className="text-2xl mb-4">Edit Category</h1>
      {category ? (
        <AddForm onSubmit={handleUpdate} category={category} />
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
