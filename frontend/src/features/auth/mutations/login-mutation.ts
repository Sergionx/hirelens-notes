import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { isRedirect } from "@tanstack/react-router"

import { loginFn } from "@/api/auth"
import { authKeys } from "@/lib/query-keys/auth"

import type { LoginSchema } from "../components/LoginForm/schema"

export function useLoginMutation() {
  const loginMutationFn = useServerFn(loginFn)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: LoginSchema) => {
      const res = await loginMutationFn({ data })
      if (res?.error) throw new Error(res.error)

      return res
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.me.queryKey })
    },
    onError: async (err) => {
      if (isRedirect(err)) {
        await queryClient.invalidateQueries({ queryKey: authKeys.me.queryKey })
        throw err
      }
    },
  })
}
