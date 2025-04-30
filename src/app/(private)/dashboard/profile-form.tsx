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
import { useRef, useState } from "react";
import {
  AccountResType,
  UpdateMeBody,
  UpdateMeBodyType,
  UpdatePassWordBody,
  UpdatePassWordBodyType,
  AuthBody,
  UpdateAuthBodyType,
  AccountAuthResType,
  AuthAppBody,
  AuthAppBodyType,
  verifyAuthAppType,
  verifyAuthApp,
} from "@/schemaValidations/account.schema";
import accountApiRequest from "@/apiRequests/account";
import { Loader } from "react-feather";
import { toast } from "react-toastify";
import { useAppContext } from "@/app/app-provider";
import Image from "next/image";

type Profile = AccountAuthResType["user"];

const ProfileForm = ({ profile }: { profile: Profile }) => {
  console.log(profile)
  const { setUser } = useAppContext();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const dialogRef = useRef(null);

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
  const formAuth = useForm<UpdateAuthBodyType>({
    resolver: zodResolver(AuthBody),
    defaultValues: {
      isMail: profile.isMail,
    },
  });
  const formAuthApp = useForm<AuthAppBodyType>({
    resolver: zodResolver(AuthAppBody),
    defaultValues: {
      isAuthApp: profile.isAuthApp,
    },
  });
  const formVerify = useForm<verifyAuthAppType>({
    resolver: zodResolver(verifyAuthApp),
    defaultValues: {
      token: "",
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
  async function onSubmitAuth(values: UpdateAuthBodyType) {
    if (loading) return;
    setLoading(true);
    try {
      const sessionToken = localStorage.getItem("sessionToken") || "";
      const result = await accountApiRequest.updateMeAuth(values, sessionToken);
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
  async function onSubmitAuthApp(values: AuthAppBodyType) {
    if (loading) return;
    setLoading(true);
    try {
      const sessionToken = localStorage.getItem("sessionToken") || "";
      const result = await accountApiRequest.updateMeAuthApp(
        values,
        sessionToken
      );
      if (result) {
        setQrCode(result.payload.qrCode);
        setSecret(result.payload.secret);
        if (dialogRef.current) {
          dialogRef.current.showModal();
        }
      }
    } catch (error: any) {
      toast.error(
        "An error occurred during update your profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }
  async function handleVerify(values: verifyAuthAppType) {
    if (loading) return;
    setLoading(true);
    try {
      const sessionToken = localStorage.getItem("sessionToken") || "";
      const result = await accountApiRequest.verifyToken(values, sessionToken);
      if (result) {
        profile.isAuthApp = true;
        if (dialogRef.current) {
          dialogRef.current.close();
        }
        toast.success("Profile update successful!");
      }
    } catch (err) {
      setError("Invalid 2FA code");
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
      <Form {...formAuth}>
        <h3 className="text-2xl">Bảo mật 2 lớp bằng Email</h3>
        <form
          onSubmit={formAuth.handleSubmit(onSubmitAuth)}
          className="space-y-2 max-w-[600px] flex-shrink-0 w-full mx-auto my-4"
          noValidate
        >
          <span className="text-sm mb-4">
            "Kích hoạt tính năng bảo mật bằng Email: Một mã xác thực sẽ được gửi
            đến email của bạn khi đăng nhập."
          </span>
          <FormField
            control={formAuth.control}
            name="isMail"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 justify-between py-2">
                <span>Kích hoạt bảo mật Qua Mail</span>
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value ?? false}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="checkbox"
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

      <h3 className="text-2xl">Bảo mật 2 lớp bằng App </h3>

      <dialog id="my_modal_1" className="modal " ref={dialogRef}>
        <div className="modal-box relative ">
          <h3 className="text-lg font-bold">
            Set Up Two-Factor Authentication
          </h3>
          <p className="py-4">
            Quét mã QR bên dưới bằng ứng dụng xác thực của bạn (ví dụ: Google
            Authenticator, Authy)..
          </p>
          {qrCode ? (
            <div className="flex justify-center">
              <Image
                src={qrCode}
                alt="QR Code"
                width={200}
                height={200}
                priority
              />
            </div>
          ) : (
            <p>Loading QR code...</p>
          )}

          <Form {...formVerify}>
            <form
              onSubmit={formVerify.handleSubmit(handleVerify)}
              className="space-y-2 max-w-[600px] flex-shrink-0 w-full mx-auto"
              noValidate
            >
              <FormField
                control={formVerify.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhập Mã 2FA Code</FormLabel>
                    <FormControl>
                      <Input placeholder="2FA Cod" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-red-500 mt-2">{error}</p>}
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
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
        </div>
      </dialog>

      <Form {...formAuthApp}>
        <form
          onSubmit={formAuthApp.handleSubmit(onSubmitAuthApp)}
          className="space-y-2 max-w-[600px] flex-shrink-0 w-full mx-auto my-4"
          noValidate
        >
          <span className="text-sm mb-4">
            "Khi bật 2FA, mỗi lần đăng nhập, bạn sẽ được yêu cầu sử dụng khóa
            bảo mật, nhập mã xác minh hoặc xác nhận đăng nhập từ thiết bị di
            động, tùy theo phương thức bạn đã chọn."
          </span>

          <FormField
            control={formAuthApp.control}
            name="isAuthApp"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 justify-between py-2">
                <span>Kích hoạt bảo mật Qua ứng dụng</span>
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value ?? false}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="checkbox"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
         
          {!profile.isAuthApp ? (
            <button
              disabled={loading ? true : false}
              type="submit"
              className="btn btn-primary mt-8 bg-blue-700 w-40 text-white mx-auto flex items-center"
            >
              {loading ? <Loader className="animate-spin" /> : ""}
              Xác nhận
            </button>
          ) : null}
        </form>
      </Form>
    </>
  );
};

export default ProfileForm;
