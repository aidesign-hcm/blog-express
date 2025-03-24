import z from "zod";

export const MessageRes = z
  .object({
    message: z.string(),
  })
  .strict();

export type MessageResType = z.TypeOf<typeof MessageRes>;

export const settingRes = z.object({
  title: z.string().min(1, "Title is required"), // Make sure `title` exists
  desc: z.string().optional(),
  address: z.string().optional(),
  email: z.string().optional(),
  hotline: z.string().optional(),
  contact: z.string().optional(),
  copyright: z.string().optional(),
  footerBLock1: z.string().optional(),
  footerBLock2: z.string().optional(),
  logo: z.object({
    _id: z.string(),
    path: z.string(),
    folder: z.string(),
  }),
  ads1: z.string().optional(),
  openReg: z.boolean().optional(),
});

export type settingResType = z.TypeOf<typeof settingRes>;

export const MenuRes = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  tasks: z.array(z.any()).optional(),
  id: z.number(),
  droppable: z.boolean(),
  parent: z.number(),
  text: z.string().min(1, "Name is required"),
});

export type MenuResType = z.TypeOf<typeof MenuRes>;

export const MenuMainRes = z.object({
  _id: z.string().optional(),
  title: z.string(),
  position: z.number(),
});

export type MenuMainResype = z.TypeOf<typeof MenuMainRes>;
