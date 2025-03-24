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
  RegisterBody,
  RegisterBodyType,
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
  const [loading, setLoading] = useState(false);
  const { setUser } = useAppContext();
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);

  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });


  // 2. Define a submit handler.
  async function onSubmit(values: RegisterBodyType) {
    if (loading) return;
    setLoading(true);
    if (!captchaValue) {
      toast.error("Vui lòng xác nhận reCAPTCHA!"); // Error message in Vietnamese
      return;
    }
    const deviceId = await getDeviceId(); // Generate unique device ID
    try {
      const result = await authApiRequest.register({ ...values, deviceId });

      if (result) {
        // await authApiRequest.auth({
        //   sessionToken: result.payload.token,
        //   expiresAt: result.payload.expiresAt,
        // });
        toast.success("Đăng ký thành công.");
        setCaptchaValue(null); // Reset reCAPTCHA
        // setUser(result.payload.user);
        router.push("/login");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.payload.message);
      setErrorMessage(error.payload.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-[600px] flex-shrink-0 w-full"
        noValidate
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="username" {...field} />
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
                <Input placeholder="Mật khẩu" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Xác nhận mật khẩu"
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
  );
};

export default RegisterForm;
