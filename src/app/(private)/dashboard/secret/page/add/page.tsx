"use client";
import AddForm from "@/app/(private)/dashboard/secret/page/add/add-form";
import pageApiRequest from "@/apiRequests/page";
import { PageCreateType } from "@/schemaValidations/page.schema"; 
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AddPage = () => {
  const router = useRouter();
  const handleCreate = async (data:  PageCreateType) => {
  
    try {
      const sessionToken = localStorage.getItem("sessionToken") || "";
      const result = await pageApiRequest.createPage(data, sessionToken);
      if (result.payload.success) {
        toast.success("Thành Công");
        router.push(`/dashboard/secret/page/${result.payload.page._id}`);
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
        <h1 className="text-2xl"> Page</h1>
        <AddForm onSubmit={handleCreate} />
      </>
    );
  };
  
  export default AddPage;
  