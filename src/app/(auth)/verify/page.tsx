"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import VerifyForm from "@/components/Form/VerifyForm"; // Adjust path if needed
import authApiRequest from "@/apiRequests/auth";

export default function Verify() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-row content-center items-center justify-center max-w-4xl mx-auto overflow-y-auto px-4">
          <div className="w-full lg:w-7/12 md:px-4 my-10">Loading...</div>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const codeId = searchParams.get("id") || "";
    const typeVerify = "authmail"

  const [userId, setUserId] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!codeId) {
      setError("Invalid verification code.");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await authApiRequest.checkCode(codeId);
        const id = res?.payload?.userId ?? "";
        setUserId(id);
      } catch (err) {
        setError("Failed to load verification. Please try again later.");
      }
    };

    fetchUser();
  }, [codeId]);

  if (error) {
    return (
      <div className="container mx-auto py-4 px-4">
        <p>{error}</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="container mx-auto py-4 px-4">
        <p>Loading user information...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-row content-center items-center justify-center max-w-4xl mx-auto overflow-y-auto px-4">
      <div className="w-full lg:w-7/12 md:px-4 my-10">
        <div className="card shadow-xl bg-white dark:bg-midnight-second rounded-md p-8">
          <h1 className="text-2xl text-center mb-4">Xác nhận bước 2</h1>
          <span className="text-center block mb-4">
            Bạn cần kiểm tra Email đã khai báo nhận mã xác thực lớp 2, lấy mã
            và nhập vào ô dưới đây.
          </span>
          <VerifyForm userId={userId} typeVerify={typeVerify} />
        </div>
      </div>
    </div>
  );
}
