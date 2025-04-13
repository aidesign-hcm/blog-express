import { z } from "zod";

export const BlogCreate = z.array(
  z.object({
    _id: z.string(),
    user: z.any(),
    title: z.string().trim().min(2).max(256),
    featureImg: z.object({
      _id: z.string(),
      path: z.string(),
      folder: z.string(),
    }),
    slug: z.string().trim().min(2).max(256),
    desc: z.string(),
    index: z.number(),
    isActive: z.boolean(),
    short: z.string(),
    isFeature: z.boolean(),
    categories: z
      .array(
        z.string() // categories is now an array of strings (category IDs)
      )
      .min(1, { message: "Please select at least one category" }),
    file: z.any(),
    video: z.any()
  })
);

export const BlogUserCreate = z.array(
  z.object({
    _id: z.string(),
    user: z.any(),
    title: z.string().trim().min(2).max(256),
    featureImg: z.object({
      _id: z.string(),
      path: z.string(),
      folder: z.string(),
    }),
    slug: z.string().trim().min(2).max(256),
    desc: z.string(),
    short: z.string(),
    file: z.any(),
    video: z.any(),
    categories: z
      .array(
        z.string() // categories is now an array of strings (category IDs)
      )
      .min(1, { message: "Please select at least one category" }),
  }),
  
  
);

const BlogItem = z.object({
  _id: z.string(),
  user: z.any(),
  title: z.string().trim(),
  featureImg: z.object({
    _id: z.string(),
    path: z.string(),
    folder: z.string(),
  }),
  slug: z.string().trim(),
  desc: z.string(),
  index: z.number(),
  isActive: z.boolean(),
  isFeature: z.boolean(),
  short: z.string(),
  categories: z.array(z.string()),
  file: z.object({
    path: z.string(),
  }),
  video: z.string(),
});

export const BlogRes = z.object({
  total: z.number(),
  blogs: z.array(BlogItem),
  newBlogs: z.array(BlogItem),
});

export type BlogResType = z.infer<typeof BlogRes>;

export const HomeBlogRes = z.object({
  newBlogs: z.array(BlogItem),
  allPostPerCat: z.any()
});
export type HomeBlogResType = z.infer<typeof HomeBlogRes>;


export const BlogSingleRes = z.object({
  blog: BlogItem,
  blogs: z.array(BlogItem),
  newBlogs: z.array(BlogItem),
});

export type BlogSingleType = z.infer<typeof BlogSingleRes>;

export type BlogCreateType = z.infer<typeof BlogCreate>;

export type BlogUserCreateType = z.infer<typeof BlogUserCreate>;
