import z from "zod";

export const MediaRes = z.array(
  z.object({
    featureImg: z.object({
        _id: z.string(),
        path: z.string(),
        folder: z.string(),
      }),
    
  })
);

export type MediaResType = z.infer<typeof MediaRes>;
