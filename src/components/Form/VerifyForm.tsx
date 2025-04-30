"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Update to next/navigation
import { getDeviceId } from "@/utils/getDeviceId";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import authApiRequest from "@/apiRequests/auth";
import { AuthBodyType, AuthBody } from "@/schemaValidations/auth.schema";
import { Loader } from "react-feather";
import { toast } from "react-toastify";
import { useAppContext } from "@/app/app-provider";

export default function VerifyForm({ userId, typeVerify }) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAppContext();

  const form = useForm<AuthBodyType>({
    resolver: zodResolver(AuthBody),
    defaultValues: {
      code: "",
      userId: userId,
      deviceId: ""
    },
  });

  async function onSubmit(values: AuthBodyType) {

    if (loading) return;
    setLoading(true);

    const deviceId = await getDeviceId(); // Generate unique device ID

    try {
      let result = null
      if (typeVerify === "authapp"){
        result = await authApiRequest.VerifyAppCode({ ...values, deviceId }); // Include deviceId
      } else if (typeVerify === "authmail") {
        result = await authApiRequest.VerifyCode({ ...values, deviceId }); // Include deviceId
      }
      if (result) {
          await authApiRequest.auth({
            sessionToken: result.payload.token,
            expiresAt: result.payload.expiresAt,
            user: result.payload.user,
          });
          toast.success("Đăng nhập thành công!");
          setUser(result.payload.user);
          router.push("/dashboard");
          router.refresh();
      }
    } catch (error: any) {
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
    <Form {...form}>
      <form
        className="mx-auto w-full mb-5"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Code" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-2 text-red-500 text-sm font-medium">
          {errorMessage}
        </div>
        <button
          disabled={loading ? true : false}
          type="submit"
          className="btn btn-primary bg-blue-700 w-40 text-white mx-auto flex items-center mt-6"
        >
          {loading ? <Loader className="animate-spin" /> : ""}
          Xác Nhận
        </button>
      </form>
    </Form>
  );
}
