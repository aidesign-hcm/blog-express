import http from "@/lib/http";

import {
  UserResType,
  UserItemType,
  LogResType,
} from "@/schemaValidations/user.schema";

const userApiRequest = {
  fetchUsers: (data: object, sessionToken: string) =>
    http.post<UserResType>(`/api/administrator/users`, data, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  fetchLogs: (id: string, sessionToken: string) =>
    http.get<LogResType>(`api/administrator/log/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  deleteUser: (data: object, sessionToken: string) =>
    http.delete<UserResType>(`api/administrator/users/${data._id}`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  fetchUserById: (id: string, sessionToken: string, signal: AbortSignal) =>
    http.get<UserItemType>(`api/administrator/users/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  CreateUser: (data: object, sessionToken: string) =>
    http.post<UserResType>(`api/administrator/signup`, data, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  updateUser: (data: object, sessionToken: string) =>
    http.put<UserResType>(`api/administrator/change-info/`, data, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  updatePassUser: (data: object, sessionToken: string) =>
    http.put<UserResType>(`api/administrator/users/change-pass/`, data, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
};

export default userApiRequest;
