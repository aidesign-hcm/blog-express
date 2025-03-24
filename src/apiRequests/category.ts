import http from "@/lib/http";

import { CategoryResType } from "@/schemaValidations/category.schema";

const categoryApiRequest = {
  fetchCategories: (data: object) =>
    http.post<CategoryResType>(`api/post_cat/get-all`, data),
  fetchAllCategories: () => http.get<CategoryResType>(`api/post_cat/`),
  fetchAllCategoriesByUser: (sessionToken: string) =>
    http.get<CategoryResType>(`api/post_cat/by-user`,  {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  fetchCategoryById: (id: string) =>
    http.get<CategoryResType>(`api/post_cat/admin/${id}`),
  createCategory: (data: object, sessionToken: string) =>
    http.post<CategoryResType>(`api/post_cat/`, data, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  updateCategory: (data: object, sessionToken: string) =>
    http.put<CategoryResType>(`api/post_cat/edit-cat`, data, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  deleteCategory: (data: object, sessionToken: string) =>
    http.delete<CategoryResType>(`api/post_cat/${data._id}`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
};

export default categoryApiRequest;
