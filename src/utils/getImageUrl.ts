import envConfig from "@/config";

export function getImageUrl(path: string | undefined): string {
  if (!path) return ""; // Handle cases where the path is undefined
  return `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/${path}`;
}
