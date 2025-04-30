import envConfig from "@/config";
import { normalizePath } from "@/lib/utils";
import { LoginResType } from "@/schemaValidations/auth.schema";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";

type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

const ENTITY_ERROR_STATUS = 404;
const SOME_ERROR_STATUS = 403;
const AUTHENTICATION_ERROR_STATUS = 401;

type EntityErrorPayload = {
  message: string;
  errors: {
    code: string;
    message: string;
  }[];
};

export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };
  constructor({ status, payload }: { status: number; payload: any }) {
    super("Http Error");
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: 403;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: 403;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload });

    this.status = status;
    this.payload = payload;
  }
}

let clientLogoutRequest: null | Promise<any> = null;
export const isClient = () => typeof window !== "undefined";
const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  options?: CustomOptions | undefined
) => {
  let body: FormData | string | undefined = undefined;
  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }
  const baseHeaders: {
    [key: string]: string;
  } =
    body instanceof FormData
      ? {}
      : {
          "Content-Type": "application/json",
        };
  if (isClient()) {
    const sessionToken = localStorage.getItem("sessionToken");
    if (sessionToken) {
      baseHeaders.Authorization = `Bearer ${sessionToken}`;
    }
  }
  // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js Server

  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;
  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    } as any,
    body,
    method,
  });

  // Check if the response has a JSON content-type before parsing
  let payload: any = null;
  const contentType = res.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    try {
      payload = await res.json();
    } catch (error) {
      console.error("Failed to parse JSON response:", error);
      payload = null; // Prevent further errors
    }
  } else {
    payload = await res.text(); // Fallback to text in case of non-JSON response
  }

  const data = {
    status: res.status,
    payload,
  };

  if (!res.ok) {
    if (
      res.status === ENTITY_ERROR_STATUS ||
      res.status === SOME_ERROR_STATUS
    ) {
      throw new EntityError(
        data as { status: 403; payload: EntityErrorPayload }
      );
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      if (isClient()) {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch("/api/auth/logout", {
            method: "POST",
            body: JSON.stringify({ force: true }),
            headers: { ...baseHeaders } as any,
          });

          try {
            const handleMessage = async (event: {
              origin: string;
              data: any;
            }) => {
              if (event.origin !== `${process.env.NEXT_PUBLIC_API_ENDPOINT}`)
                return;
            };
            window.addEventListener("message", handleMessage);
            await clientLogoutRequest;
          } catch (error) {
          } finally {
            localStorage.removeItem("user");
            localStorage.removeItem("sessionToken");
            clientLogoutRequest = null;
            location.href = "/login";
          }
        }
      } else {
        let sessionToken = "";

        if (typeof window !== "undefined") {
          // Client-side, get sessionToken from localStorage
          sessionToken = localStorage.getItem("sessionToken") || "";
        } else {
          // Server-side, get sessionToken from headers
          const authHeader = (options?.headers as any)?.Authorization;
          if (authHeader?.startsWith("Bearer ")) {
            sessionToken = authHeader.split("Bearer ")[1];
          }
        }
        redirect(`/logout?sessionToken=${sessionToken}`);
      }
    } else {
      throw new HttpError(data);
    }
  }

  // Đảm bảo logic dưới đây chỉ chạy ở phía client (browser)
  if (isClient()) {
    if (
      [
        "api/auth/verify-app-code",
        "api/auth/verify-code",
        "api/auth/login",
        // "api/auth/signup",
        "auth",
        
        // "wp-json/jwt-auth/v1/google_login",
      ].some((item) => item === normalizePath(url))
    ) {
      const { token } = payload as LoginResType;
     
      localStorage.setItem("sessionToken", token);
    } else if ("auth/logout" === normalizePath(url)) {
      localStorage.removeItem("user");
      localStorage.removeItem("sessionToken");
    }
  }
  return data;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  patch<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PATCH", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, { ...options });
  },
};

export default http;
