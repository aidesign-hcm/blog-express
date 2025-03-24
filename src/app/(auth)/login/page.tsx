"use client";
import React, { useState, useEffect, useRef } from "react";
import authApiRequest from "@/apiRequests/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { useAppContext } from "@/app/app-provider";
import { Loader } from "react-feather";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import { getDeviceId } from "@/utils/getDeviceId";
import { useSetting } from "@/context/SettingContext";

const LoginForm = () => {
  const { setting } = useSetting();
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const router = useRouter();
  const { setUser } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
      deviceId: ""
    },
  });
  async function onSubmit(values: LoginBodyType) {
    // if (!captchaValue) {
    //   toast.error("Vui lòng xác nhận reCAPTCHA!"); // Error message in Vietnamese
    //   return;
    // }

    if (loading) return;
    setLoading(true);

    const deviceId = await getDeviceId(); // Generate unique device ID

    try {
      const result = await authApiRequest.login({ ...values, deviceId }); // Include deviceId
      if (result) {
        await authApiRequest.auth({
          sessionToken: result.payload.token,
          expiresAt: result.payload.expiresAt,
          user: result.payload.user,
        });
        toast.success("Đăng nhập thành công!");
        setCaptchaValue(null); // Reset reCAPTCHA
        setUser(result.payload.user);
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error: any) {
      // setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("sessionToken");
      localStorage.removeItem("sessionTokenExpiresAt");

      const status = error.status as number;
      if (status === 403) {
        setErrorMessage(error.payload.code);
      }
      toast.error(error.payload.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-row content-center items-center justify-center max-w-4xl mx-auto overflow-y-auto px-4">
        <div className="w-full lg:w-7/12 md:px-4 my-10">
          <div className="card shadow-xl bg-white dark:bg-midnight-second rounded-md p-8">
            <h1 className="text-2xl text-center mb-4">Đăng nhập</h1>
            {/* <div className="flex items-center w-full justify-center content-center"><GoogleSignInButton /></div>
            <div className="divider">Or</div> */}
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="password"
                          type="password"
                          {...field}
                        />
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
                  Xác Nhận
                </button>
                <div className="mt-6 relative text-center text-blue-500">
                  <Link href="/forgot-pass" className="underline">
                    Quên mật khẩu
                  </Link>
                </div>
                {setting ? (
                  setting.openReg && (
                    <div className="mt-6 relative text-center">
                      <span>
                        Bạn chưa có tài khoản?
                        <Link href="/register" className="text-blue-500 ml-1">
                          Đăng ký tại đây
                        </Link>
                      </span>
                    </div>
                  )
                ) : (
                  <p>Loading...</p>
                )}
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
