"use client";
import React, { useState, useEffect, useRef } from "react";
import authApiRequest from "@/apiRequests/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { forGotBodyType, forGotBody } from "@/schemaValidations/auth.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { Loader } from "react-feather";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import { getDeviceId } from "@/utils/getDeviceId";


const LoginForm = () => {
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<forGotBodyType>({
    resolver: zodResolver(forGotBody),
    defaultValues: {
      email: "",
    },
  });
  async function onSubmit(values: forGotBodyType) {
    if (loading) return;
    setLoading(true);
    const deviceId = await getDeviceId(); 
    try {
      const result = await authApiRequest.forgot({ ...values, deviceId });
      if (result) {
        toast.success("Password reset code sent to your email.");
        router.push("/change-password");
        setCaptchaValue(null);
        router.refresh();
      }
    } catch (error: any) {
      toast.error("Failed to send email. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <div className="flex flex-row content-center items-center justify-center max-w-4xl mx-auto overflow-y-auto px-4">
        <div className="w-full lg:w-7/12 md:px-4 my-10">
          <div className="card shadow-xl bg-white dark:bg-midnight-second rounded-md p-8">
            <h1 className="text-2xl text-center mb-4">Quên mật khẩu</h1>
            <Form {...form}>
              <form
                className="mx-auto w-full mb-5"
                onSubmit={form.handleSubmit(onSubmit)}
                noValidate
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="email" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-2 text-red-500 text-sm font-medium">
                  {errorMessage}
                </div>
                <ReCAPTCHA
                  sitekey="6LeIch0UAAAAAM_8PR3aphkM7LtCK-5SBn6RZBlV"
                  onChange={(value) => setCaptchaValue(value)}
                />
                <button
                  disabled={loading ? true : false}
                  type="submit"
                  className="btn btn-primary bg-blue-700 w-40 text-white mx-auto flex items-center mt-6"
                >
                  {loading ? <Loader className="animate-spin" /> : ""}
                  Xác nhận
                </button>
                <div className="mt-6 relative text-center">
                  <span>
                    Bạn đã có tài khoản?
                    <Link href="/login" className="text-blue-500 ml-1">
                      Đăng nhập tại đây
                    </Link>
                  </span>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
