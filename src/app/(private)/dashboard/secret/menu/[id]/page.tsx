"use client";
import DraggableList from "@/components/Widget/DraggableList";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import settingApiRequest from "@/apiRequests/common";
import { useEffect, useState } from "react";
import { MenuRes, MenuMainRes } from "@/schemaValidations/common.schema"; // Import the schema
import { z } from "zod";

type ListFormValues = z.infer<typeof MenuRes>;
type MainFormValues = z.infer<typeof MenuMainRes>;

export default function Menu({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [getList, setOnList] = useState<ListFormValues>();
  const [getMain, setOnMain] = useState<MainFormValues>({ title: "", position: 0, _id: "" });
  const Id = params.id;

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const result = await settingApiRequest.GetMenu(Id);
        if (result.payload?.success) {
          setOnList(result.payload.onList || []); // Ensure it's always an array
          setOnMain(result.payload.onMain || { title: "", position: 0, _id: "" }); // Ensure default object
        } else {
          console.error("Error fetching menu:", result.payload?.message);
        }
      } catch (error) {
        console.error("Unexpected error fetching menu:", error);
      }
    };

    if (Id) {
      fetchMenu();
    }
  }, [Id]);

  const handleCreate = async (data: any) => {
    try {
      const sessionToken = localStorage.getItem("sessionToken") || "";
      const result = await settingApiRequest.EditMenu(data, sessionToken);

      if (result.payload?.success) {
        toast.success("Thành Công");
        router.push(`/dashboard/secret/menu/${result.payload.menu._id}`);
      } else {
        toast.error("An error occurred during update. Please try again.");
        console.error("Error:", result.payload?.message);
      }
    } catch (error) {
      console.error("Unexpected error during update:", error);
      toast.error("An error occurred during update. Please try again.");
    }
  };

  return <DraggableList handleSubmit={handleCreate} getList={getList} getMain={getMain} />;
}
