import z from "zod";

export const RegisterBody = z
  .object({
    username: z.string().trim().min(2).max(256),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
    // deviceId: z.string()
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Confirm password incorrect",
        path: ["confirmPassword"],
      });
    }
  });

export type RegisterBodyType = z.TypeOf<typeof RegisterBody>;

export const RegisterRes = z.object({
  token: z.string(),
  user: z.object({
    _id: z.number(),
    username: z.string(),
    email: z.string(),
    rule: z.string(),
  }),
  message: z.string(),
});

export type RegisterResType = z.TypeOf<typeof RegisterRes>;

export const LoginBody = z
  .object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
    deviceId: z.string()
  })
  .strict();

export type LoginBodyType = z.TypeOf<typeof LoginBody>;

export const forGotBody = z
  .object({
    email: z.string().email(),
  })
  .strict();

export type forGotBodyType = z.TypeOf<typeof forGotBody>;

export const ChangePassBody = z
  .object({
    email: z.string().email(),
    code: z.string(),
    password: z.string().min(6).max(100),
  })
  .strict();

export type ChangePassBodyType = z.TypeOf<typeof ChangePassBody>;

export const LoginRes = RegisterRes;

export type LoginResType = z.TypeOf<typeof LoginRes>;
export const SlideSessionBody = z.object({}).strict();

export type SlideSessionBodyType = z.TypeOf<typeof SlideSessionBody>;
export const SlideSessionRes = RegisterRes;

export type SlideSessionResType = z.TypeOf<typeof SlideSessionRes>;

