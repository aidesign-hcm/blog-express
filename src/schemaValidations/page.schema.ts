import { z } from "zod";

export const PageCreate = z.array(
  z.object({
    _id: z.string(),
    user: z.any(),
    title: z.string().trim().min(2).max(256),
    slug: z.string().trim().min(2).max(256),
    desc: z.string(),
    index: z.number(),
    isActive: z.boolean(),
    short: z.string(),
  })
);

const PageItem = z.object({
  _id: z.string(),
  user: z.any(),
  title: z.string().trim(),
  slug: z.string().trim(),
  desc: z.string(),
  index: z.number(),
  isActive: z.boolean(),
  short: z.string(),
});

export const PageRes = z.object({
  total: z.number(),
  pages: z.array(PageItem),
});


export const PageSingleRes = z.object({
  page: PageItem,
});

export type PageResType = z.infer<typeof PageRes>;

export type PageSingleType = z.infer<typeof PageSingleRes>;

export type PageCreateType = z.infer<typeof PageCreate>;
