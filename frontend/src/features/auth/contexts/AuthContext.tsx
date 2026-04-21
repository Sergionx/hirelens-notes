import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { isRedirect } from "@tanstack/react-router"
import { toast } from "sonner"

import { userQueryOptions } from "@/features/auth/queries/user-query"
import { useLogoutMutation } from "@/features/auth/mutations/logout-mutation"

import type { User } from "../schemas/user-schema"

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
  logout: () => void
}

export const AuthContext = React.createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useQuery(userQueryOptions)
  const logoutMutation = useLogoutMutation()

  const logout = React.useCallback(async () => {
    try {
      await logoutMutation.mutateAsync()
    } catch (err) {
      if (isRedirect(err)) throw err

      toast.error((err as Error).message)
    }
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
