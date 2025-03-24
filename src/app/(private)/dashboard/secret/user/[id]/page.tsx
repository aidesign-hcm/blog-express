"use client";
import { useEffect, useState } from "react";
import EditForm from "@/app/(private)/dashboard/secret/user/add/edit-form";
import { AdminEditResBodyType, PasswordResBodyType } from "@/schemaValidations/user.schema"; // Import the schema
import userApiRequest from "@/apiRequests/user";
import { toast } from "react-toastify";
import categoryApiRequest from "@/apiRequests/category";
import Link from "next/link";


export default function EditUser({ params }: { params: { id: any } }) {
  const [user, setUser] = useState<AdminEditResBodyType | null>(null);
  const userId = params.id;
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
  
    const fetchUser = async () => {
      try {
        const sessionToken = localStorage.getItem("sessionToken") || "";
        const result = await userApiRequest.fetchUserById(userId, sessionToken, signal);
        const resCategories = await categoryApiRequest.fetchAllCategories(signal);
  
        if (!signal.aborted) {
          if (result.payload.success) {
            setUser(result.payload.user);
            setCategories(resCategories.payload.categories);
          } else {
            console.error("Error fetching user:", result.message);
          }
        }
      } catch (error) {
        if (!signal.aborted) {
          console.error("Unexpected error:", error);
        }
      }
    };
  
    if (userId) {
      fetchUser();
    }
  
    return () => {
      controller.abort(); // Cleanup function to cancel the request
    };
  }, [userId]);

  const handleUpdate = async (data: AdminEditResBodyType) => {
    try {
      const sessionToken = localStorage.getItem("sessionToken") || "";
      const result = await userApiRequest.updateUser( data, sessionToken );
      
      if (result.payload.success) {
        setUser(result.payload.user);
        toast.success("Update successful!");
      } else {
        console.error("Error updating category:", result.message);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An error occurred during update. Please try again.");
    }
  };

  const onSubmitPass = async (data: PasswordResBodyType) => {
    try {
      const sessionToken = localStorage.getItem("sessionToken") || "";
      const result = await userApiRequest.updatePassUser( data, sessionToken );
      if (result.payload.success) {
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
      <h1 className="text-2xl mb-4">Chỉnh sửa tài khoản</h1>
      <Link className="text-primary mb-2 block" href={`/dashboard/secret/blog?user=${user?._id}`}>Xem bài viết của thành viên</Link>
      <Link className="text-primary mb-2 block" href={`/dashboard/secret/user/log/${user?._id}`}>Xem User log</Link>
      {user ? (
        <EditForm onSubmit={handleUpdate} onSubmitPass={onSubmitPass} user={user} oncategories={categories} />
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
