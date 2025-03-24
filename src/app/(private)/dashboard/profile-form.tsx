"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AccountResType,
  UpdateMeBody,
  UpdateMeBodyType,
  UpdatePassWordBody,
  UpdatePassWordBodyType,
} from "@/schemaValidations/account.schema";
import accountApiRequest from "@/apiRequests/account";
import { Loader } from "react-feather";
import { toast } from "react-toastify";
import { useAppContext } from "@/app/app-provider";

type Profile = AccountResType["user"];

const ProfileForm = ({ profile }: { profile: Profile }) => {
  const { setUser } = useAppContext();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      username: profile.username,
    },
  });

  const formPass = useForm<UpdatePassWordBodyType>({
    resolver: zodResolver(UpdatePassWordBody),
    defaultValues: {
      newPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: UpdateMeBodyType) {
    if (loading) return;
    setLoading(true);
    try {
      const sessionToken = localStorage.getItem("sessionToken") || "";
      const result = await accountApiRequest.updateMe(values, sessionToken);
      if (result) {
        setUser(result.payload.user);
        toast.success("Profile update successful!");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(
        "An error occurred during update your profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }
  async function onSubmitPass(values: UpdatePassWordBodyType) {
    if (loading) return;
    setLoading(true);
    try {
      const sessionToken = localStorage.getItem("sessionToken") || "";
      const result = await accountApiRequest.updateMePassword(
        values,
        sessionToken
      );
      if (result) {
        // setUser(result.payload.user);
        toast.success("Profile update successful!");
      }
    } catch (error: any) {
      toast.error(
        "An error occurred during update your profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 max-w-[600px] flex-shrink-0 w-full mx-auto"
          noValidate
        >
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input
              placeholder="shadcn"
              type="email"
              value={profile.email}
              readOnly
            />
          </FormControl>
          <FormMessage />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nick name</FormLabel>
                <FormControl>
                  <Input placeholder="Nick name" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button
            disabled={loading ? true : false}
            type="submit"
            className="btn btn-primary mt-8 bg-blue-700 w-40 text-white mx-auto flex items-center"
          >
            {loading ? <Loader className="animate-spin" /> : ""}
            Xác nhận
          </button>
        </form>
      </Form>
      <Form {...formPass}>
        <form
          onSubmit={formPass.handleSubmit(onSubmitPass)}
          className="space-y-2 max-w-[600px] flex-shrink-0 w-full mx-auto"
          noValidate
        >
          <FormField
            control={formPass.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu cũ</FormLabel>
                <FormControl>
                  <Input placeholder="password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formPass.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu mới</FormLabel>
                <FormControl>
                  <Input placeholder="password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formPass.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Xác nhận mật khẩu</FormLabel>
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
          <button
            disabled={loading ? true : false}
            type="submit"
            className="btn btn-primary mt-8 bg-blue-700 w-40 text-white mx-auto flex items-center"
          >
            {loading ? <Loader className="animate-spin" /> : ""}
           Xác nhận
          </button>
        </form>
      </Form>
    </>
  );
};

export default ProfileForm;
