"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AddForm from "@/components/Form/AddBlog";
import { BlogRes, BlogUserCreate } from "@/schemaValidations/blog.schema";
import blogApiRequest from "@/apiRequests/blog";
import { toast } from "react-toastify";
import { z } from "zod";

type BlogFormValues = z.infer<typeof BlogUserCreate>[0];
export default function EditBlog({ params }: { params: { id: any } }) {
  const [blog, setBlog] = useState<BlogFormValues | null>(null);
  const Id = params.id;
  const sessionToken = localStorage.getItem("sessionToken") || "";
  const router = useRouter();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const result = await blogApiRequest.userFetchBlogById(Id, sessionToken);
        if (result.payload.success) {
          setBlog(result.payload.post);
        } else {
          toast.error("Error fetching blog.");
          console.error("Error fetching category:", result.message);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    if (Id) {
      fetchBlog();
    }
  }, [Id]);

  if (!blog) {
    return <p>Loading...</p>; // Ensure `blog` is loaded before rendering
  }

  const handleUpdate = async (data: BlogFormValues) => {
    try {
      const sessionToken = localStorage.getItem("sessionToken") || "";
      const result = await blogApiRequest.userUpdateBlog(data, sessionToken);
      if (result.payload.success) {
        setBlog(result.payload.post);
        toast.success("Thành Công");
      } else {
        toast.error("An error occurred during update. Please try again.");
        console.error("Error creating Blog:", result.payload.message);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An error occurred during update. Please try again.");
    }
  };

  return (
    <>
      <h1 className="text-2xl"> Blog</h1>
      <AddForm onSubmit={handleUpdate} blog={blog} />
    </>
  );
}
