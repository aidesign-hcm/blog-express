import http from "@/lib/http";

import { settingResType } from "@/schemaValidations/common.schema";

const settingApiRequest = {
  fetchSetting: (sessionToken: string) =>
    http.get<settingResType>(`api/setting/admin`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  commonFetchSetting: () => http.get<settingResType>(`api/setting/`),
  CraeteSetting: (data: object, sessionToken: string) =>
    http.put<settingResType>(`api/setting/`, data, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
    EditorSetting: (data: object, sessionToken: string) =>
      http.put<settingResType>(`api/setting/editor`, data, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }),
  CraeteMenu: (data: object, sessionToken: string) =>
    http.post<settingResType>(`api/menu/`, data, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  EditMenu: (data: object, sessionToken: string) =>
    http.put<settingResType>(`api/menu/edit`, data, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  GetMenu: ( id: string ) =>
    http.get<settingResType>(`api/menu/${id}`),
  fetchMenus: ( data: object,  sessionToken: string ) =>
    http.post<settingResType>(`api/menu/get-all`, data, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),

    deleteMenu: ( data: object,  sessionToken: string ) =>
      http.delete<settingResType>(`api/menu/${data._id}`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }),
};

export default settingApiRequest;
