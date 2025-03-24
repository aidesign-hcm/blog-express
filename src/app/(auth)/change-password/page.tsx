"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  ChangePassBody,
  ChangePassBodyType,
} from "@/schemaValidations/auth.schema";
import authApiRequest from "@/apiRequests/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppContext } from "@/app/app-provider";
import { Loader } from "react-feather";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import { getDeviceId } from "@/utils/getDeviceId";

const RegisterForm = () => {
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAppContext();

  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<ChangePassBodyType>({
    resolver: zodResolver(ChangePassBody),
    defaultValues: {
      email: "",
      code: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: ChangePassBodyType) {
    if (!captchaValue) {
      toast.error("Vui lòng xác nhận reCAPTCHA!"); // Error message in Vietnamese
      return;
    }
    if (loading) return;
    setLoading(true);
      const deviceId = await getDeviceId(); 
    try {
      const result = await authApiRequest.changepass({ ...values, deviceId });
      toast.success("Change Password successful!");
      setCaptchaValue(null);
      router.push("/login");
      router.refresh();
    } catch (error: any) {
      toast.error(
        "An error occurred during change Password. Please try again."
      );
      setErrorMessage(error.payload.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex flex-row content-center items-center justify-center max-w-4xl mx-auto overflow-y-auto px-4">
      <div className="w-full lg:w-7/12 md:px-4 my-10">
        <div className="card shadow-xl bg-white dark:bg-midnight-second rounded-md p-8">
          <h1 className="text-2xl text-center mb-4">
            Đặt lại mật khẩu của bạn
          </h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="max-w-[600px] flex-shrink-0 w-full"
              noValidate
            >
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="email" type="email" {...field} />
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
                        placeholder="Mật khẩu"
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
                Xác nhận
              </button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
