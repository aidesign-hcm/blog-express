"use client";

import RegisterForm from "@/app/(auth)/register/register-form";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSetting } from "@/context/SettingContext";

const RegisterPage = () => {
  const router = useRouter();
  const { setting } = useSetting();

  useEffect(() => {
    if (setting && setting.openReg === false) {
      router.push("/login");
    }
  }, [setting, router]);

  if (!setting) {
    return  <div className="bg-gray-100 py-16 flex items-center justify-center">
    <span className="loading loading-dots loading-xl"></span>
</div>; // Prevent flickering
  }

  return (
    <div className="flex flex-row content-center items-center justify-center max-w-4xl mx-auto overflow-y-auto px-4">
      <div className="w-full lg:w-7/12 md:px-4 my-10">
        <div className="card shadow-xl bg-white dark:bg-midnight-second rounded-md p-8">
          <h1 className="text-2xl text-center mb-4">Đăng Ký</h1>
          <div className="flex justify-center">
            <RegisterForm />
          </div>
          <div className="mt-6 relative text-center">
            <span>
              Bạn đã có tài khoản?
              <Link href="/login" className="text-blue-500 ml-1">
                Đăng nhập tại đây
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
