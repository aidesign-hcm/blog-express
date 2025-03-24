import { z } from "zod";
// Define the schema for the environment variables
const configSchema = z.object({
  NEXT_PUBLIC_API_ENDPOINT: z.string().url(),
  NEXT_PUBLIC_URL: z.string().url(),
  CRYPTOJS_SECRECT: z.any()
});

// Parse and validate the environment variables
const configProject = configSchema.safeParse({
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  CRYPTOJS_SECRECT: process.env.CRYPTOJS_SECRECT
});

// Check if the parsing and validation were successful
if (!configProject.success) {
  console.error("Invalid environment variables:", configProject.error.issues);
  throw new Error("Các giá trị khai báo trong file .env không hợp lệ");
}

// Extract the validated environment variables
const envConfig = configProject.data;

// Export the configuration
export default envConfig;

