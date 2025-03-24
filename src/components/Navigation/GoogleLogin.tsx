import { useGoogleOneTapLogin } from '@react-oauth/google';
import authApiRequest from "@/apiRequests/auth";
import { useAppContext } from "@/app/app-provider";
import { useRouter } from "next/navigation";

export default function GoogleSignInButton() {
  const { setUser } = useAppContext();
  const router = useRouter();
  const login = useGoogleOneTapLogin({
    onSuccess: async credentialResponse=> {
      try {
        const id_token = credentialResponse.credential || ''
        const result = await authApiRequest.loginWithGoogle({id_token: id_token});
        if (result) {
          await authApiRequest.auth({
            sessionToken: result.payload.token,
            expiresAt: result.payload.expiresAt,
          });
          setUser(result.payload.account);
          router.refresh();
        }
      } catch (error: any) {

      }
    },
    onFailure: (error) => console.log('Login failed', error),
    scope: "openid profile email"
  });

  return "";
}
