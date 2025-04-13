import z from "zod";

export const CategoryRes = z.array(
  z.object({
    _id: z.string(),
    name: z.string(),
    featureImg: z.object({
      _id: z.string(),
      path: z.string(),
      folder: z.string(),
    }),
    slug: z.string(),
    content: z.string(),
    index: z.number(),
    isFeature: z.boolean(),
    isDefault: z.boolean(),
    parent: z.any(),
    ancestors: z.array(
      z.object({
        _id: z.string(),
      })
    ),
    block: z.number(),
    iconImg: z.string(),
  })
);

export type CategoryResType = z.infer<typeof CategoryRes>;


export const CategoryCreate = z.array(
  z.object({
    _id: z.string(),
    name: z.string().trim().min(2).max(256),
    featureImg: z.object({
      _id: z.string(),
      path: z.string(),
      folder: z.string(),
    }),
    slug: z.string().trim().min(2).max(256),
    content: z.string(),
    index: z.number(),
    isFeature: z.boolean(),
    isDefault: z.boolean(),
    parent: z.any(),
    ancestors: z.array(
      z.object({
        _id: z.string(),
      })
    ),
    block: z.number(),
    iconImg: z.string(),
  })
);

export type CategoryCreateType = z.infer<typeof CategoryCreate>;
