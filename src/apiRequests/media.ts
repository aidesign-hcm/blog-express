import http from "@/lib/http";

import { MediaResType } from "@/schemaValidations/media.schema";

const mediaApiRequest = {
  postMedia: (data: object, sessionToken: string) =>
    http.post<MediaResType>(`api/media/product`, data, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  postLogo: (data: object, sessionToken: string) =>
    http.post<MediaResType>(`api/media/single-noresize`, data, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
    postFileMedia: (data: object, sessionToken: string) =>
      http.post<MediaResType>(`api/media/file`, data, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }),
    
};

export default mediaApiRequest;
