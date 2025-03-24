"use client";

import AddForm from "@/app/(private)/dashboard/secret/user/add/add-form";
import { useRouter } from "next/navigation";
import { AdminRegisterBodyType } from "@/schemaValidations/user.schema"; 
import { toast } from "react-toastify";
import userApiRequest from "@/apiRequests/user";

export default function AddUser() {
  const router = useRouter();

  const handleCreate = async (data: AdminRegisterBodyType) => {
    try {
      const sessionToken = localStorage.getItem("sessionToken") || "";
      const result = await userApiRequest.CreateUser(data, sessionToken);
      if (result.payload.success) {
        toast.success("Thành Công");
        router.push(`/dashboard/secret/user/${result.payload.user._id}`);
      } else {
        toast.error(result.payload.message);
        console.error("Error creating:", result.payload.message);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error(error.payload.message);
    }
  };
  return (
    <>
      <h1 className="text-2xl mb-4">Thêm Thành Viên</h1>
      <AddForm onSubmit={handleCreate} />
    </>
  );
}
