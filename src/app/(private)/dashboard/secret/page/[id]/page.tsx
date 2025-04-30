"use client";
import { useEffect, useState } from "react";
import AddForm from "@/app/(private)/dashboard/secret/page/add/add-form";
import { PageCreate } from "@/schemaValidations/page.schema";
import pageApiRequest from "@/apiRequests/page";
import { toast } from "react-toastify";
import { z } from "zod";
import Revision from "@/components/Widget/Revision";

type PageFormValues = z.infer<typeof PageCreate>[0];

export default function EditPage({ params }: { params: { id: any } }) {
  const [page, setPage] = useState< PageFormValues | null>(null);
  const Id = params.id;
  const sessionToken = localStorage.getItem("sessionToken") || "";
  useEffect(() => {
    const fetchPage = async () => {
      try {
        const result = await pageApiRequest.fetchPageById(Id, sessionToken);
       
        if (result.payload.success) {
          setPage(result.payload.page);
        } else {
          toast.success("Thành Công");
          console.error("Error fetching category:", result.message);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    if (Id) {
      fetchPage();
    }
  }, [Id]);
  const handleUpdate = async (data: PageFormValues) => {
    try {
      const result = await pageApiRequest.updatePage( data, sessionToken );
      if (result.payload.success) {
        setPage(result.payload.page);
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
      {page? (
        <>
        <AddForm onSubmit={handleUpdate} page={page} />
        <Revision post={page} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
