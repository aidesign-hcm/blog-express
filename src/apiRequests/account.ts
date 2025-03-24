import http from '@/lib/http'
import {
  AccountResType,
  UpdateMeBodyType,
  UpdatePassWordBodyType 
} from '@/schemaValidations/account.schema'

const accountApiRequest = {
  me: (sessionToken: string) =>
    http.get<AccountResType>('/api/auth/user', {
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
  })
}

export default accountApiRequest