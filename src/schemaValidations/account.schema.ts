import z from "zod";

export const AccountRes = z
  .object({
    user: z.object({
      _id: z.number(),
      username: z.string(),
      email: z.string(),
      rule: z.string(),
    }),
    message: z.string(),
  })
  .strict();

export type AccountResType = z.TypeOf<typeof AccountRes>;

export const UpdateMeBody = z.object({
  username: z.string().trim().min(2).max(256),
});

export type UpdateMeBodyType = z.TypeOf<typeof UpdateMeBody>;

export const UpdatePassWordBody = z.object({
  password: z.string().min(6).max(100),
  newPassword: z.string().min(6).max(100),
  confirmPassword: z.string().min(6).max(100),
  
})
.superRefine(({ confirmPassword, newPassword }, ctx) => {
  if (confirmPassword !== newPassword) {
    ctx.addIssue({
      code: "custom",
      message: "Confirm password incorrect",
      path: ["confirmPassword"],
    });
  }
});

export type UpdatePassWordBodyType = z.TypeOf<typeof UpdatePassWordBody>;
