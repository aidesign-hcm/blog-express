"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AddForm from "@/app/(private)/dashboard/secret/blog/add/add-form";
import { BlogRes, BlogCreate } from "@/schemaValidations/blog.schema";
import blogApiRequest from "@/apiRequests/blog";
import { toast } from "react-toastify";
import { z } from "zod";
import Revision from "@/components/Widget/Revision";

type BlogFormValues = z.infer<typeof BlogCreate>[0];

export default function EditBlog({ params }: { params: { id: any } }) {
  const [blog, setBlog] = useState<BlogFormValues | null>(null);
  const Id = params.id;
  const sessionToken = localStorage.getItem("sessionToken") || "";
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const result = await blogApiRequest.fetchBlogById(Id, sessionToken);
       
        if (result.payload.success) {
          setBlog(result.payload.post);
        } else {
          toast.success("Thành Công");
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
  const handleUpdate = async (data: BlogFormValues) => {
    try {
      const result = await blogApiRequest.updateBlog( data, sessionToken );
      if (result.payload.success) {
        setBlog(result.payload.post);
        toast.success("Thành Công");
      } else {
        toast.error("An error occurred during update. Please try again.");
        console.error("Error updating category:", result.payload.message);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An error occurred during update. Please try again.");
    }
  };

  return (
    <>
      <h1 className="text-2xl"> Single Blog</h1>
      {blog? (
        <>
        <AddForm onSubmit={handleUpdate} blog={blog} />
        <Revision post={blog} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
