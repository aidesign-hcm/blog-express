"use client";
import DraggableList from "@/components/Widget/DraggableList";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import settingApiRequest from "@/apiRequests/common";

export default function Menu() {
  const router = useRouter();
  const handleCreate = async (data: any) => {
    try { 
      const sessionToken = localStorage.getItem("sessionToken") || "";
      const result = await settingApiRequest.CraeteMenu(data, sessionToken);
      if (result.payload.success) {
        toast.success("Thành Công");
        router.push(`/dashboard/secret/menu/${result.payload.menu._id}`);
      } else {
        toast.error("An error occurred during update. Please try again.");
        console.error("Error:", result.payload.message);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An error occurred during update. Please try again.");
    }
  };
  return <DraggableList handleSubmit={handleCreate} />;
}
