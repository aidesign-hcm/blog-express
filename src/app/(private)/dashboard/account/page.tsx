import { cookies } from "next/headers";
import ProfileForm from "@/app/(private)/dashboard/profile-form";
import accountApiRequest from "@/apiRequests/account";

export default async function DashBoard() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");
  const result = await accountApiRequest.meAuth(sessionToken?.value ?? "");
  return (
    <>
        <h1 className="text-2xl">Thông tin tài khoản</h1>
        <ProfileForm profile={result.payload.user} />
    </>
  );
}
