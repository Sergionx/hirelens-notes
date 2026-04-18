import * as React from "react"
import { useServerFn } from "@tanstack/react-start"
import { useQuery } from "@tanstack/react-query"

import { queries } from "@/lib/query-keys"

import { getCurrentUserFn, logoutFn } from "./server"

interface User {
  username: string
  userId: number
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
  logout: () => void
}

export const AuthContext = React.createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const currentUserQuery = useServerFn(getCurrentUserFn)
  const { data: user, isLoading } = useQuery({
    queryKey: queries.auth.me.queryKey,
    queryFn: () => currentUserQuery(),
  })
  const logoutMutation = useServerFn(logoutFn)

  const logout = React.useCallback(async () => {
    await logoutMutation()
  }, [logoutMutation])

  const value = React.useMemo(
    () => ({
      isAuthenticated: !!user,
      user: user || null,
      isLoading,
      logout,
    }),
    [user, isLoading, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
