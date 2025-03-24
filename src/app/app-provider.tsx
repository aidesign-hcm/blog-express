'use client'
// path/to/AppProvider.tsx
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { AccountResType } from '../schemaValidations/account.schema'

type User = AccountResType['user']

const AppContext = createContext<{
  user: User | null
  setUser: (user: User | null) => void
  isAuthenticated: boolean
}>({
  user: null,
  setUser: () => {},
  isAuthenticated: false
})

export const useAppContext = () => {
  return useContext(AppContext)
}

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(() => {
    return null
  })

  const isAuthenticated = Boolean(user)

  const setUser = useCallback(
    (user: User | null) => {
      setUserState(user)
      localStorage.setItem('user', JSON.stringify(user))
    },
    [setUserState]
  )

  useEffect(() => {
    const _user = localStorage.getItem('user')
    setUserState(_user ? JSON.parse(_user) : null)
  }, [setUserState])

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider
