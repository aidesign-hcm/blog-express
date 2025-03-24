import { z } from "zod";

const UserItem = z.object({
  _id: z.string(),
  username: z.string(),
  phonenumber: z.number(),
  email: z.string().email(),
  createdAt: z.string().date(),
  private: z.boolean(),
  rule: z.string(),
});

export const UserRes = z.object({
  total: z.number(),
  users: z.array(UserItem),
});

export type UserResType = z.infer<typeof UserRes>;

export type UserItemType = z.infer<typeof UserItem>;

export const AdminRegisterBody = z
  .object({
    username: z.string().trim().min(2).max(256),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    phonenumber: z.string(),
  })
  .strict();

export type AdminRegisterBodyType = z.TypeOf<typeof AdminRegisterBody>;

export const AdminEditResBody = z
  .object({
    _id: z.string(),
    username: z.string().trim().min(2).max(256),
    email: z.string().email(),
    phonenumber: z.any(),
    private: z.boolean(),
    rule: z.enum(["user", "admin", "manager", "editor"]), // Enum for rule
    rank: z.string(),
    gender: z.enum(["Male", "Female", "Not"]),
    bio: z.any(),
    categories: z
      .array(
        z.string()
      )
  })
  .strict();

export type AdminEditResBodyType = z.infer<typeof AdminEditResBody>;

// Define Zod Schema
export const PasswordResBody = z
  .object({
    _id: z.string(),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

// Type from Schema
export type PasswordResBodyType = z.infer<typeof PasswordResBody>;

const LogItem = z.object({
  _id: z.string(),
  user: z.string(), // Assuming it references a user ID
  ip: z.string(),
  device: z.string(),
  loginTime: z.string().datetime(), // Ensure it's a valid timestamp
  logoutTime: z.string().datetime().nullable(), // Allow null if user is still logged in
});

export const LogRes = z.object({
  logs: z.array(LogItem),
});

export type LogResType = z.infer<typeof LogRes>;