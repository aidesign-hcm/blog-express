import http from "@/lib/http";

import {
  PageResType,
  //   BlogSingleType,
  //   HomeBlogResType,
} from "@/schemaValidations/page.schema";

const pageApiRequest = {
  fetchAllPage: (data: object, sessionToken: string) =>
    http.post<PageResType>(`api/page/all`, data, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  fetchAllPages: () => http.get<PageResType>(`api/page/`),
  fetchPageById: (id: string, sessionToken: string) =>
    http.get<PageResType>(`api/page/admin/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  //   userFetchBlogById: (id: string, sessionToken: string) =>
  //     http.get<BlogResType>(`api/post/user/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${sessionToken}`,
  //       },
  //     }),
  fetchPageBySlug: (id: string) =>
    http.get<PageResType>(`api/page/${id}`, {
      cache: "no-store",
    }),

  //   fetchBlogByAuthor: (slug: string, data: object, sessionToken: string) =>
  //     http.get<BlogSingleType>(
  //       `api/post/author/${slug}?page=${data.page}&perPage=${data.perPage}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${sessionToken}`,
  //         },
  //       }
  //     ),

  //   fetchBlogHome: () =>
  //     http.get<HomeBlogResType>(`api/post/home`, {
  //       cache: "no-store",
  //     }),
  createPage: (data: object, sessionToken: string) =>
    http.post<PageResType>(`api/page/`, data, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  //   userCreateBlog: (data: object, sessionToken: string) =>
  //     http.post<BlogResType>(`api/post/user-create`, data, {
  //       headers: {
  //         Authorization: `Bearer ${sessionToken}`,
  //       },
  //     }),
  updatePage: (data: object, sessionToken: string) =>
    http.put<PageResType>(`api/page/single/${data._id}`, data, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  //   userUpdateBlog: (data: object, sessionToken: string) =>
  //     http.put<BlogResType>(`api/post/user/single/${data._id}`, data, {
  //       headers: {
  //         Authorization: `Bearer ${sessionToken}`,
  //       },
  //     }),
  bulkActivate: (data: object, sessionToken: string) =>
    http.put<PageResType>(`api/page/active-multi`, data, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  bulkDelete: (data: object, sessionToken: string) =>
    http.patch<PageResType>(`api/page/delete-multi`, data, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  deletePage: (data: object, sessionToken: string) =>
    http.delete<PageResType>(`api/page/single/${data._id}`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  //   fetchBlogByCategory: (slug: string, data: object) =>
  //     http.get<BlogResType>(
  //       `api/post/by-cat/${slug}?page=${data.page}&perPage=${data.perPage}`,
  //       {
  //         cache: "no-store",
  //       }
  //     ),
  //   fetchBlogByUser: (data: object, sessionToken: string) =>
  //     http.get<BlogResType>(
  //       `api/post/by-user?page=${data.page}&perPage=${data.perPage}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${sessionToken}`,
  //         },
  //       }
  //     ),
  //     fetchBlogByManager: (data: object, sessionToken: string) =>
  //       http.get<BlogResType>(
  //         `api/post/by-manager?page=${data.page}&perPage=${data.perPage}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${sessionToken}`,
  //           },
  //         }
  //       ),
  //   fetchBlogBySearch: (data: object) =>
  //     http.post<BlogResType>(
  //       `api/post/search?text=${data.query}&page=${data.page}&perPage=${data.perPage}`,
  //       {
  //         cache: "no-store",
  //       }
  //     ),
};

export default pageApiRequest;
