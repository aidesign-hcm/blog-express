import http from '@/lib/http'
require('dotenv').config()
import {
  LoginBodyType,
  LoginResType,
  RegisterBodyType,
  RegisterResType,
  SlideSessionResType,
  forGotBodyType,
  ChangePassBodyType,
  AuthResBodyType,
  AuthBodyType
} from '@/schemaValidations/auth.schema'
import { MessageResType } from '@/schemaValidations/common.schema'

const authApiRequest = {
  login: (body: LoginBodyType) => http.post<LoginResType>('/api/auth/login', body),
  // loginWithGoogle: (body: {id_token: string}) => http.post<LoginResType>('/wp-json/jwt-auth/v1/google_login', body),
  register: (body: RegisterBodyType) =>
    http.post<RegisterResType>('/api/auth/signup', body),
  forgot: (body: forGotBodyType) =>
    http.put<forGotBodyType>('/api/auth/app-forgot-pass', body),
  changepass: (body: ChangePassBodyType) =>
    http.put<ChangePassBodyType>('/api/auth/app-reset-pass', body),
  auth: (body: { sessionToken: string; expiresAt: string, user: any }) =>
    http.post(`/api/auth`, body, {
      baseUrl: ''
  }),
  checkCode: (codeId: string) =>
    http.get<AuthResBodyType>(`/api/auth/check-code/${codeId}`),
  VerifyAppCode: (body: AuthBodyType) => 
    http.post<LoginResType>(`/api/auth/verify-app-code`, body),
  VerifyCode: (body: AuthBodyType) => 
    http.post<LoginResType>(`/api/auth/verify-code`, body),
  logoutFromNextServerToServer: (body: {sessionToken: string }) =>
    http.post<MessageResType>(
      '/api/auth/blacklist-token/', body,  {
        headers: {
          Authorization: `Bearer ${body.sessionToken}`
        }
      }),
  logoutFromNextClientToNextServer: (
    force?: boolean | undefined,
    signal?: AbortSignal | undefined
  ) =>
    http.post<MessageResType>(
      '/api/auth/logout',
      {
        force
      },
      {
        baseUrl: '',
        signal
      }
    ),
  slideSessionFromNextServerToServer: (sessionToken: string ) =>
    http.post<SlideSessionResType>(
      '/auth/slide-session',
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`
        }
      }
    ),
  slideSessionFromNextClientToNextServer: () =>
    http.post<SlideSessionResType>(
      '/api/auth/slide-session',
      {},
      { baseUrl: '' }
    )
}

export default authApiRequest