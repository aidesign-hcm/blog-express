"use client";
import AddForm from "@/app/(private)/dashboard/secret/blog/add/add-form";
import blogApiRequest from "@/apiRequests/blog";
import { BlogCreateType } from "@/schemaValidations/blog.schema"; 
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";



const AddBlog = () => {
  const router = useRouter();
  const handleCreate = async (data:  BlogCreateType) => {
  
    try {
      const sessionToken = localStorage.getItem("sessionToken") || "";
      const result = await blogApiRequest.createBlog(data, sessionToken);
      if (result.payload.success) {
        toast.success("Thành Công");
        router.push(`/dashboard/secret/blog/${result.payload.post._id}`);
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
        <AddForm onSubmit={handleCreate} />
      </>
    );
  };
  
  export default AddBlog;
  