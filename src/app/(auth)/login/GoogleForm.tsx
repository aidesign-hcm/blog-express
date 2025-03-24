import { GoogleLogin } from "@react-oauth/google";
import authApiRequest from "@/apiRequests/auth";
import { useAppContext } from "@/app/app-provider";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Loader } from "react-feather";
import { toast } from "react-toastify";

export default function GoogleSignInButton() {
  const { setUser } = useAppContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <>
      {loading ? (
        <div className="absolute bg-white bg-opacity-60 top-0 bottom-0 flex items-center justify-center left-0 right-0 z-10">
          <div className="flex items-center">
            <Loader className="animate-spin" />
          </div>
        </div>
      ) : (
        ""
      )}
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          setLoading(true);
          try {
            const id_token = credentialResponse.credential || "";
            const result = await authApiRequest.loginWithGoogle({
              id_token: id_token,
            });

            if (result) {
              await authApiRequest.auth({
                sessionToken: result.payload.token,
                expiresAt: result.payload.expiresAt,
              });
              toast.success("Login successful!");
              setUser(result.payload.account);
              router.refresh();
            }
          } catch (error: any) {
            setLoading(false);
            toast.error("An error occurred during login. Please try again.");
          }
        }}
        onError={() => {
          console.log("Login Failed");
          toast.error("An error occurred during login. Please try again.");
        }}
      />
    </>
  );
}
