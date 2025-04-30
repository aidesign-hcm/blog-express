import http from '@/lib/http'
import {
  AccountResType,
  UpdateMeBodyType,
  UpdatePassWordBodyType,
  UpdateAuthBodyType,
  AccountAuthResType,
  AuthAppBodyType,
  verifyAuthAppType
} from '@/schemaValidations/account.schema'

const accountApiRequest = {
  me: (sessionToken: string) =>
    http.get<AccountResType>('/api/auth/user', {
      headers: {
        Authorization: `Bearer ${sessionToken}`
      }
  }),
  meAuth: (sessionToken: string) =>
    http.get<AccountAuthResType>('/api/auth/user/profile', {
      headers: {
        Authorization: `Bearer ${sessionToken}`
      }
  }),

  
  meClient: () => http.get<AccountResType>('account/me'),
  
  updateMe: (body: UpdateMeBodyType, sessionToken: string) =>
    http.put<AccountResType>('/api/auth/user/profile', body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`
      }
  }),
  updateMePassword: (body: UpdatePassWordBodyType, sessionToken: string) =>
    http.put<AccountResType>('/api/auth/change-pass', body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`
      }
  }),
  updateMeAuth: (body: UpdateAuthBodyType, sessionToken: string) =>
    http.put<AccountResType>('/api/auth/active-mail', body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`
      }
  }),
  updateMeAuthApp: (body: AuthAppBodyType, sessionToken: string) =>
    http.put<AccountResType>('/api/auth/active-authapp', body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`
      }
  }),
  verifyToken: (body: verifyAuthAppType, sessionToken: string) =>
    http.put<AccountResType>('/api/auth/verify-authapp', body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`
      }
  })
}

export default accountApiRequest