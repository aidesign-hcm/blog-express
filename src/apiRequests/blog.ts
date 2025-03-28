import http from "@/lib/http";

import {
  BlogResType,
  BlogSingleType,
  HomeBlogResType,
} from "@/schemaValidations/blog.schema";

const blogApiRequest = {
  fetchAllBlog: (data: object, sessionToken: string, feature: string) =>
    http.post<BlogResType>(`api/post/all?feature=${feature}`, data, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  fetchBlogById: (id: string, sessionToken: string) =>
    http.get<BlogResType>(`api/post/admin/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  userFetchBlogById: (id: string, sessionToken: string) =>
    http.get<BlogResType>(`api/post/user/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  fetchBlogBySlug: (id: string) =>
    http.get<BlogSingleType>(`api/post/${id}`, {
      cache: "no-store",
    }),

  fetchBlogByAuthor: (slug: string, data: object, sessionToken: string) =>
    http.get<BlogSingleType>(
      `api/post/author/${slug}?page=${data.page}&perPage=${data.perPage}`,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    ),

  fetchBlogHome: () =>
    http.get<HomeBlogResType>(`api/post/home`, {
      cache: "no-store",
    }),
  createBlog: (data: object, sessionToken: string) =>
    http.post<BlogResType>(`api/post/`, data, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  userCreateBlog: (data: object, sessionToken: string) =>
    http.post<BlogResType>(`api/post/user-create`, data, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  updateBlog: (data: object, sessionToken: string) =>
    http.put<BlogResType>(`api/post/single/${data._id}`, data, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  userUpdateBlog: (data: object, sessionToken: string) =>
    http.put<BlogResType>(`api/post/user/single/${data._id}`, data, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  bulkActivate: (data: object, sessionToken: string) =>
    http.put<BlogResType>(`api/post/active-multi`, data, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  bulkDelete: (data: object, sessionToken: string) =>
    http.patch<BlogResType>(`api/post/delete-multi`, data, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  deleteBlog: (data: object, sessionToken: string) =>
    http.delete<BlogResType>(`api/post/single/${data._id}`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  fetchBlogByCategory: (slug: string, data: object) =>
    http.get<BlogResType>(
      `api/post/by-cat/${slug}?page=${data.page}&perPage=${data.perPage}`,
      {
        cache: "no-store",
      }
    ),
  fetchBlogByUser: (data: object, sessionToken: string) =>
    http.get<BlogResType>(
      `api/post/by-user?page=${data.page}&perPage=${data.perPage}`,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    ),
    fetchBlogByManager: (data: object, sessionToken: string) =>
      http.get<BlogResType>(
        `api/post/by-manager?page=${data.page}&perPage=${data.perPage}`,
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      ),
  fetchBlogBySearch: (data: object) =>
    http.post<BlogResType>(
      `api/post/search?text=${data.query}&page=${data.page}&perPage=${data.perPage}`,
      {
        cache: "no-store",
      }
    ),
};

export default blogApiRequest;
